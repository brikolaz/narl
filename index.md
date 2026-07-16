---
layout: default
title: NARL
---

# NARL

<p align="center">
    <img src="assets/images/gameplay.png" />
</p>

Emergent fuckery simulator disguised as a 1D roguelike.

LLM-driven design. Human-in-the-loop bonanza.

[REPO](https://github.com/brikolaz/narl)

## Posts

{% for post in site.posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
  {% endfor %}
