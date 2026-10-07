---
title: "Hello, world — how this blog works"
description: "A sample post that shows the Markdown features the blog supports. Delete or edit me."
date: 2026-10-07
tags: [meta]
draft: true
---

This is a sample post. It is marked `draft: true`, so it shows up in `npm run dev` but is **excluded from the production build**. Set `draft: false` to publish it, or delete the file.

## Writing a post

Add a `.md` file to `src/content/blog/`. The filename becomes the URL: `welcome.md` → `/blog/welcome/`.

## Code

```python
import numpy as np

def sharpe(returns: np.ndarray, rf: float = 0.0) -> float:
    excess = returns - rf
    return excess.mean() / excess.std(ddof=1)
```

## Lists, quotes, tables

> Statistics is the grammar of science.

| Metric | Value |
| ------ | ----- |
| Mean   | 0.12  |
| Std    | 0.34  |

- Bullet one
- Bullet two

## Math

Inline math works with single dollars: the sample mean is $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$, and returns are $r_t = \ln(P_t / P_{t-1})$.

Display math uses double dollars. Mean–variance portfolio optimisation:

$$
\min_{w}\; w^\top \Sigma\, w \quad \text{s.t.} \quad \mu^\top w \ge r_{\text{target}},\; \mathbf{1}^\top w = 1,\; w \ge 0
$$

And the Sharpe ratio:

$$
S = \frac{\mathbb{E}[R_p - R_f]}{\sigma_p}
$$

To write a literal dollar sign in prose, escape it: \$5.
