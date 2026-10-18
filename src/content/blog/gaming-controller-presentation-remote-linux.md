---
title: "Turning a Gaming Controller into a Wireless Presentation Remote on Linux"
description: "Why buy a dedicated presentation clicker when you already have a gaming controller lying around? Using a Cosmic Byte Ares controller and AntiMicroX to control slides on Ubuntu."
date: 2026-10-18
tags: [linux, tooling, hardware]
---

*Why buy a dedicated presentation clicker when you already have a gaming controller lying around?*

I recently decided to repurpose my **Cosmic Byte Ares Tri-Mode controller** as a wireless presentation remote for my Ubuntu laptop.

The idea was simple: use the controller's D-pad to navigate slides, assign buttons to presentation shortcuts, and perhaps even use the analog stick as a mouse.

It turned out to be surprisingly practical, although getting everything working required a little troubleshooting.

Here's how I did it.

## 1. What You'll Need

- A Linux PC (I'm using Ubuntu).
- Cosmic Byte Ares Tri-Mode wireless controller.
- The supplied 2.4 GHz USB dongle.
- AntiMicroX, an open-source controller-to-keyboard mapping utility.

The same general approach should work with other controllers supported by Linux.

## 2. Connecting the Controller to Linux

I initially struggled with the controller repeatedly connecting in Android mode (green LED), even though I wanted to use its USB dongle.

After some experimentation, I checked whether Ubuntu could actually detect the receiver.

With the dongle plugged in, run:

```bash
lsusb
```

My output included:

```text
ID 2563:0526 ShenZhen ShanWan Technology Co., Ltd. Ares
```

Promising!

Next, I checked whether Linux had registered the controller as an input device:

```bash
ls /dev/input/by-id/
```

Output:

```text
usb-_Ares-event-joystick
usb-_Ares-hidraw
usb-_Ares-joystick
```

At this point, Ubuntu could see the device. However, detecting a USB receiver doesn't necessarily mean the controller is successfully communicating with it.

We need to test that separately.

## 3. Testing Controller Inputs

Install the joystick testing utility:

```bash
sudo apt install joystick
```

Run:

```bash
jstest /dev/input/js0
```

This opens a terminal-based interface displaying the controller's button and axis states.

Press a few buttons, move the analog sticks, and try the D-pad.

If the corresponding values change, Linux is successfully receiving controller inputs.

In my case, everything worked!

Now for the interesting part.

## 4. Installing AntiMicroX

[AntiMicroX](https://github.com/AntiMicroX/antimicroX) is an open-source application that lets you map gamepad inputs to keyboard keys and mouse actions.

Essentially, it allows a controller to impersonate a keyboard and mouse.

Download the appropriate `.deb` package from its GitHub releases page.

Install it using:

```bash
sudo apt install ./antimicrox*.deb
```

Then launch:

```bash
antimicrox
```

Unfortunately, my first attempt produced this error:

```text
Selecting uinput as a default event generator.
Could not open uinput device file
Please check that you have permission to write to the device:
/dev/uinput

Failed to open event generator. Exiting.
```

### Fixing the uinput permission error

AntiMicroX needs access to Linux's `uinput` interface to generate virtual keyboard and mouse events.

First, load the module:

```bash
sudo modprobe uinput
```

Create a dedicated group:

```bash
sudo groupadd -f uinput
sudo usermod -aG uinput "$USER"
```

Configure the device permissions:

```bash
echo 'KERNEL=="uinput", MODE="0660", GROUP="uinput", OPTIONS+="static_node=uinput"' | sudo tee /etc/udev/rules.d/99-uinput.rules
```

Reload the rules:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

Log out and log back in to activate your new group membership.

You can verify access using:

```bash
ls -l /dev/uinput
groups
```

Then launch AntiMicroX again.

An alternative for X11 users is:

```bash
antimicrox --eventgen xtest
```

This uses XTest instead of `uinput`.

## 5. Turning the Controller into a Presentation Remote

Once AntiMicroX opens, it should display your connected controller and its available inputs.

Pressing a physical controller button highlights the corresponding button in the application.

Click that button to assign a keyboard shortcut.

Here's the configuration I recommend:

| Controller input | Keyboard mapping | Function |
|---|---|---|
| D-pad Right | Right Arrow | Next slide |
| D-pad Left | Left Arrow | Previous slide |
| RB | Right Arrow | Next slide |
| LB | Left Arrow | Previous slide |
| A | F5 | Start slideshow |
| B | Escape | Exit slideshow |
| Left Analog Stick | Mouse movement | Move pointer |
| RT | Left Mouse Button | Mouse click |

*Note: Presentation shortcuts may differ between LibreOffice Impress, PowerPoint and Google Slides. For example, Google Slides uses Ctrl+F5 to start presenting.*

### Why map multiple buttons to the same action?

Convenience.

Sometimes navigating with the D-pad feels natural. Other times, using the shoulder buttons is easier, particularly when holding the controller in one hand.

Having both options makes the setup more flexible.

## 6. Saving the Configuration

Once everything is mapped, save your AntiMicroX profile.

I named mine:

```text
Presentation.gamecontroller.amgp
```

You can load a saved profile directly from the terminal:

```bash
antimicrox --profile ~/path/to/Presentation.gamecontroller.amgp
```

This means you don't have to manually configure every button before each presentation.

## 7. Testing It with LibreOffice Impress

Open a presentation in LibreOffice Impress.

Start the slideshow and test the controller:

- Press D-pad Right to advance.
- Press D-pad Left to return to the previous slide.
- Move the analog stick to control the pointer.
- Press B to exit the presentation.

The controller now functions as a wireless presentation remote.

You can also experiment with additional mappings, such as assigning a button to blank the presentation screen or switching between windows.

## Final Thoughts

What started as a small experiment turned into a useful way to repurpose a gaming controller.

The entire setup uses free, open-source software, requires no modification to the controller, and works with the USB receiver that came in the box.

The most important takeaway is that **Linux already recognizes many gaming controllers as standard input devices. AntiMicroX simply bridges the gap between those inputs and ordinary keyboard shortcuts.**

A gaming controller might look unusual in someone's hand during a research presentation, but it can do considerably more than a conventional slide clicker.

And I already had one sitting on my desk.

---

**Useful resources**

- [AntiMicroX – GitHub](https://github.com/AntiMicroX/antimicroX)
- [Cosmic Byte Ares Tri-Mode User Manual](https://cdns3.thecosmicbyte.com/wp-content/uploads/Cosmic-Byte-Ares-Tri-Mode-User-Manual-1.pdf)
- [Linux Kernel Documentation – uinput](https://docs.kernel.org/input/uinput.html)
