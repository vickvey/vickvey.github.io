---
title: "Setting Up LazyVim on a Remote Ubuntu Server Without Sudo"
description: "A practical guide to installing LazyVim on a shared Linux server, handling dependencies, fixing a Tree-sitter GLIBC compatibility issue, and customizing the status bar to distinguish remote environments."
date: 2026-10-18
tags: [neovim, linux, tooling]
---

When working on a shared research server, you don't always have `sudo` privileges. Installing development tools can become complicated, particularly when system packages are outdated or managed by administrators.

This guide documents my experience setting up LazyVim on a remote Ubuntu 22.04 server without modifying system-wide packages.

We'll cover installation, dependency management, a Tree-sitter compatibility issue, and a small customization that makes remote development easier.

## 1. Check Your Existing Neovim Installation

First, verify whether Neovim is already installed:

```bash
nvim --version
```

In my case:

```text
NVIM v0.12.5
Build type: Release
LuaJIT 2.1
```

This version is sufficient for LazyVim.

If Neovim isn't installed, or your version is too old, you can install a prebuilt release inside your home directory without requiring administrator privileges.

Download the appropriate Linux archive from the [official Neovim releases](https://github.com/neovim/neovim/releases).

For example, after downloading the `nvim-linux-x86_64.tar.gz` archive:

```bash
mkdir -p ~/.local

tar -xzf nvim-linux-x86_64.tar.gz -C ~/.local

export PATH="$HOME/.local/nvim-linux-x86_64/bin:$PATH"
```

Add the PATH export to your `~/.bashrc` to make it persistent.

**If you have sudo:** You can use your system's package manager, but check the available version first. Ubuntu's default repositories may contain an older Neovim release that does not satisfy LazyVim's requirements.

## 2. Inspect the Required Dependencies

LazyVim needs a few external tools for searching, plugin installation, syntax highlighting, and language support.

Check what's already available:

```bash
for cmd in nvim git gcc make curl unzip rg fd fdfind node npm tree-sitter fzf lazygit; do
    if command -v "$cmd" &>/dev/null; then
        printf "%-15s %s\n" "$cmd" "$(command -v "$cmd")"
    else
        printf "%-15s MISSING\n" "$cmd"
    fi
done
```

My initial results were:

| Dependency | Status |
|---|---|
| Neovim | Installed |
| Git | Installed |
| GCC / Make | Installed |
| curl / unzip | Installed |
| Node.js / npm | Installed through NVM |
| ripgrep | Missing |
| fd | Missing |
| Tree-sitter CLI | Missing |
| fzf | Missing |
| lazygit | Missing |

The last two are optional. They can be installed later.

## 3. Install Ripgrep and fd Without Sudo

Ripgrep (`rg`) enables fast text searching, while `fd` provides efficient file discovery.

Initially, I attempted:

```bash
conda install -c conda-forge ripgrep fd-find -y
```

Unfortunately, this failed with:

```text
EnvironmentNotWritableError:
The current user does not have write permissions
to the target environment.

environment location: /opt/miniconda3
```

The reason was straightforward: the Conda base environment belonged to the system administrator.

Rather than modifying shared directories, create a separate environment under your home directory.

```bash
conda create -p ~/.conda/envs/nvim-tools \
    -c conda-forge ripgrep fd-find -y
```

Make the executables accessible without activating Conda:

```bash
mkdir -p ~/.local/bin

ln -s ~/.conda/envs/nvim-tools/bin/rg ~/.local/bin/rg
ln -s ~/.conda/envs/nvim-tools/bin/fd ~/.local/bin/fd
```

Ensure your shell can locate them:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

source ~/.bashrc
```

Verify:

```bash
rg --version
fd --version
```

In my setup, the resulting versions were:

```text
ripgrep 15.2.0
fd 10.5.0
```

**If you have sudo:** Install these directly using:

```bash
sudo apt update
sudo apt install ripgrep fd-find
```

On Ubuntu, the `fd` executable may be named `fdfind`. You can create an alias or symlink if necessary.

## 4. Install Node.js Using NVM

Node.js is useful for several Neovim plugins and language-development tools.

On my server, Node.js was already installed under my home directory:

```text
~/.nvm/versions/node/v24.20.0/bin/node
```

If you don't have Node.js, I recommend using [NVM](https://github.com/nvm-sh/nvm).

Once NVM is installed:

```bash
nvm install --lts
nvm use --lts
```

Verify:

```bash
node --version
npm --version
```

NVM keeps Node.js installations inside your home directory, avoiding conflicts with system packages.

**If you have sudo:** You can install Node.js system-wide, although NVM remains useful when projects require different Node versions.

## 5. The Tree-sitter GLIBC Problem

This was the most interesting issue encountered during installation.

I initially installed Tree-sitter CLI using npm:

```bash
npm install -g tree-sitter-cli
```

The installation completed, but verification produced:

```text
GLIBC_2.39 not found
```

Checking the server's GLIBC version revealed:

```bash
ldd --version | head -1
```

Output:

```text
ldd (Ubuntu GLIBC 2.35-0ubuntu3.15) 2.35
```

The downloaded Tree-sitter executable expected a newer GLIBC version than the server provided.

**Do not attempt to upgrade GLIBC manually on a shared server.** It is a fundamental system library, and replacing it can break other applications.

Instead, compile Tree-sitter locally against the server's existing libraries.

### Install Rust without sudo

First, check whether Rust is already installed:

```bash
cargo --version
rustc --version
```

Both were missing on my server.

Install Rust using rustup:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Select the default installation.

Load the environment:

```bash
source "$HOME/.cargo/env"
```

Verify:

```bash
cargo --version
rustc --version
```

### Compile Tree-sitter locally

Remove the incompatible npm installation:

```bash
npm uninstall -g tree-sitter-cli
```

Compile the CLI:

```bash
cargo install tree-sitter-cli --version 0.27.1 --locked
```

This builds Tree-sitter locally instead of relying on the incompatible prebuilt executable.

Verify:

```bash
which tree-sitter
tree-sitter --version
```

The executable should be located at:

```text
~/.cargo/bin/tree-sitter
```

**If you have sudo:** You can install Rust through your system package manager, but compiling Tree-sitter locally is still a suitable solution. Having sudo does not automatically resolve binary compatibility issues.

**Storage tip:** Rust's build cache can consume substantial disk space. If storage is limited, inspect `~/.cargo` and `~/.rustup` after installation. Avoid deleting the compiled Tree-sitter executable.

## 6. Install LazyVim

Before installing LazyVim, inspect your existing Neovim configuration:

```bash
ls -lah \
    ~/.config/nvim \
    ~/.local/share/nvim \
    ~/.local/state/nvim \
    ~/.cache/nvim 2>/dev/null
```

In my case, `~/.config/nvim` did not exist. Only some old logs and state files were present.

If you already have a configuration, back it up first:

```bash
mv ~/.config/nvim ~/.config/nvim.backup
```

Now clone the official LazyVim starter:

```bash
git clone https://github.com/LazyVim/starter ~/.config/nvim
```

Remove the starter repository's Git history:

```bash
rm -rf ~/.config/nvim/.git
```

Launch Neovim:

```bash
nvim
```

LazyVim will bootstrap its plugin manager and download the configured plugins.

You can inspect the installation using:

```vim
:Lazy
```

And check the environment using:

```vim
:checkhealth
```

No sudo privileges are required for this process.

## 7. Customize LazyVim for Remote Development

I regularly work on the same Git repository from my laptop and a remote server.

This introduces a small but annoying problem: when both terminals have LazyVim open, it isn't immediately obvious which machine I'm working on.

I wanted a persistent hostname indicator in LazyVim's bottom status bar.

Fortunately, LazyVim uses `lualine.nvim`, which makes this straightforward.

### Create a custom status bar component

On the server:

```bash
mkdir -p ~/.config/nvim/lua/plugins

nano ~/.config/nvim/lua/plugins/statusline.lua
```

Add:

```lua
return {
  {
    "nvim-lualine/lualine.nvim",
    opts = function(_, opts)
      local hostname = vim.uv.os_gethostname()

      opts.sections.lualine_x = opts.sections.lualine_x or {}

      table.insert(opts.sections.lualine_x, 1, {
        function()
          return "SERVER: " .. hostname
        end,
        color = {
          fg = "#ffcc00",
          gui = "bold",
        },
      })
    end,
  },
}
```

Restart Neovim.

The bottom status bar now includes:

```text
NORMAL │ main │ my-project │ ... │ SERVER: my-server
```

The hostname is retrieved automatically, so the configuration doesn't need to hardcode the server name.

It also requires no additional plugins, background services, or network requests.

### What about syncing laptop and server configurations?

Neovim configurations are independent by default.

For example:

```text
Laptop
└── ~/.config/nvim/
    └── Local configuration

Server
└── ~/.config/nvim/
    └── Remote configuration
```

Even if both machines use the same Git project, their Neovim settings are not automatically synchronized.

You could maintain a separate Git repository containing your Neovim configuration and clone it onto both machines, but that is entirely optional.

For now, I prefer keeping the two installations independent.

## 8. Keeping LazyVim Lightweight

One of my reasons for exploring terminal-based development was disk consumption.

My previous VS Code Remote SSH setup had accumulated approximately 4.1 GB under `.vscode-server`, primarily from five separate server installations.

LazyVim doesn't require VS Code Server, although its own plugins, language servers, parsers, and caches still consume disk space.

You can inspect its storage usage using:

```bash
du -h --max-depth=1 ~/.local/share/nvim | sort -hr
```

Also inspect:

```bash
du -sh \
    ~/.config/nvim \
    ~/.local/share/nvim \
    ~/.local/state/nvim \
    ~/.cache/nvim 2>/dev/null
```

Some recommendations:

- Install only the language servers you actually use.
- Avoid enabling unnecessary LazyVim extras.
- Keep your Neovim configuration in Git.
- Periodically inspect Mason-installed language servers.
- Avoid installing editor dependencies into a shared Conda base environment.

For Python development, start with the relevant LazyVim Python extra rather than installing every available language integration.

## 9. Final Installation Checklist

After completing the setup, verify:

```bash
nvim --version
git --version
rg --version
fd --version
node --version
npm --version
tree-sitter --version
```

Then launch Neovim and run:

```vim
:checkhealth
```

Your final setup should resemble:

| Component | Installation location |
|---|---|
| Neovim | `~/.local/nvim-linux-x86_64/` |
| LazyVim configuration | `~/.config/nvim/` |
| Plugins | `~/.local/share/nvim/` |
| Ripgrep / fd | User-owned Conda environment |
| Node.js | `~/.nvm/` |
| Rust | `~/.cargo/`, `~/.rustup/` |
| Tree-sitter CLI | `~/.cargo/bin/` |
| Custom status bar | `~/.config/nvim/lua/plugins/statusline.lua` |

All without modifying system-wide packages.

## Conclusion

Setting up a modern development environment on a shared Linux server doesn't necessarily require administrator privileges.

The key is to keep installations isolated inside your home directory, avoid modifying shared environments, and compile incompatible tools locally when necessary.

In this setup, the biggest challenge wasn't LazyVim itself—it was resolving the Tree-sitter binary's GLIBC incompatibility with Ubuntu 22.04.

With that addressed, LazyVim provides a practical terminal-based development environment for working over SSH, particularly when switching frequently between a laptop and a remote research server.

And with a simple hostname indicator in the status bar, I no longer need to guess which machine I'm editing files on.
