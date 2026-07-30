---
layout: default
title: NARL
---

<p align="center">
    <img src="assets/images/gameplay.png" />
</p>

Emergent fuckery simulator disguised as a 1D roguelike.

LLM-driven design. Human-in-the-loop bonanza.

## Posts

{% for post in site.posts %}

- [{{ post.title }}]({{ post.url | relative_url }})
  {% endfor %}
