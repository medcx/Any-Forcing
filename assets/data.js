window.ANY_FORCING_DATA = {
  "config": {
    "title": "Any Forcing",
    "subtitle": "Any-Step Generality and One-Step Stability for Autoregressive Video Generation",
    "authors": [],
    "affiliations": [],
    "paper_url": "",
    "project_url": "https://medcx.github.io/Any-Forcing/",
    "github_owner": "medcx",
    "repository": "Any-Forcing"
  },
  "hero": [
    {
      "method": "Any Forcing",
      "src": "assets/videos/hero-panda.mp4",
      "poster": "assets/posters/hero-panda.jpg",
      "duration": 5.0625,
      "firstSteps": null
    },
    {
      "method": "Any Forcing",
      "src": "assets/videos/hero-water.mp4",
      "poster": "assets/posters/hero-water.jpg",
      "duration": 5.0625,
      "firstSteps": null
    },
    {
      "method": "Infinity RoPE",
      "src": "assets/videos/hero-infinity-15s.mp4",
      "poster": "assets/posters/hero-infinity-15s.jpg",
      "duration": 15.0,
      "firstSteps": null
    },
    {
      "method": "Any Forcing",
      "src": "assets/videos/hero-pool-attn-15s.mp4",
      "poster": "assets/posters/hero-pool-attn-15s.jpg",
      "duration": 15.0,
      "firstSteps": null
    }
  ],
  "cases": [
    {
      "id": "grapes",
      "name": "Grapes in motion",
      "kind": "short",
      "prompt": "A close-up view of a cluster of vibrant green grapes on a rotating glass table under soft, diffused lighting. The grapes are large and plump, reflecting the gentle light as they rotate slowly, showcasing their smooth, shiny surfaces. The background is blurred, focusing attention solely on the grapes and their subtle reflections. The camera remains static, capturing the serene and detailed motion of the rotating grapes. Close-up shot.",
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/grapes-ours.mp4",
          "poster": "assets/posters/grapes-ours.jpg",
          "duration": 5.0625,
          "firstSteps": null
        },
        {
          "method": "Causal Forcing",
          "src": "assets/videos/grapes-causal.mp4",
          "poster": "assets/posters/grapes-causal.jpg",
          "duration": 5.0625,
          "firstSteps": 4
        },
        {
          "method": "ASD",
          "src": "assets/videos/grapes-asd.mp4",
          "poster": "assets/posters/grapes-asd.jpg",
          "duration": 5.0625,
          "firstSteps": null
        },
        {
          "method": "One Forcing",
          "src": "assets/videos/grapes-oneforcing.mp4",
          "poster": "assets/posters/grapes-oneforcing.jpg",
          "duration": 5.0625,
          "firstSteps": null
        }
      ],
      "sampling": "One-step comparison",
      "note": ""
    },
    {
      "id": "iceberg",
      "name": "Arctic iceberg",
      "kind": "long",
      "prompt": "A large iceberg floating in the icy Arctic Ocean under a clear blue sky. The iceberg is massive, with jagged edges and smooth surfaces, showing various shades of blue and white due to compressed snow and ice. It has several crevices and cracks visible, adding to its dramatic appearance. The water around the iceberg is calm, reflecting the pristine beauty of the surrounding landscape. The camera captures the iceberg from a medium distance, providing a panoramic view of its towering presence amidst the vast ocean. Static scene, no camera movement.",
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/ice-ours.mp4",
          "poster": "assets/posters/ice-ours.jpg",
          "duration": 30.5625,
          "firstSteps": 2
        },
        {
          "method": "Infinity RoPE",
          "src": "assets/videos/ice-infinity.mp4",
          "poster": "assets/posters/ice-infinity.jpg",
          "duration": 30.5625,
          "firstSteps": 2
        },
        {
          "method": "Deep Forcing",
          "src": "assets/videos/ice-deep.mp4",
          "poster": "assets/posters/ice-deep.jpg",
          "duration": 30.5625,
          "firstSteps": 2
        },
        {
          "method": "Relax Forcing",
          "src": "assets/videos/ice-relax.mp4",
          "poster": "assets/posters/ice-relax.jpg",
          "duration": 30.5625,
          "firstSteps": 2
        }
      ],
      "sampling": "One-step comparison",
      "note": ""
    },
    {
      "id": "tokyo-60s",
      "name": "Tokyo after dark",
      "kind": "extended",
      "prompt": "A stylish woman strolls down a bustling Tokyo street, the warm glow of neon lights and animated city signs casting vibrant reflections. She wears a sleek black leather jacket paired with a flowing red dress and black boots, her black purse slung over her shoulder. Sunglasses perched on her nose and a bold red lipstick add to her confident, casual demeanor. The street is damp and reflective, creating a mirror-like effect that enhances the colorful lights and shadows. Pedestrians move about, adding to the lively atmosphere. The scene is captured in a dynamic medium shot with the woman walking slightly to one side, highlighting her graceful strides.",
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/extended-tokyo-street-first4-rest1.mp4",
          "poster": "assets/posters/extended-tokyo-street-first4-rest1.jpg",
          "duration": 60.5625,
          "firstSteps": 4
        },
        {
          "method": "Infinity RoPE",
          "src": "assets/videos/comparison-tokyo-60s-infinity.mp4",
          "poster": "assets/posters/comparison-tokyo-60s-infinity.jpg",
          "duration": 60.5625,
          "firstSteps": 4
        },
        {
          "method": "Deep Forcing",
          "src": "assets/videos/comparison-tokyo-60s-deep.mp4",
          "poster": "assets/posters/comparison-tokyo-60s-deep.jpg",
          "duration": 60.5625,
          "firstSteps": 4
        },
        {
          "method": "Relax Forcing",
          "src": "assets/videos/comparison-tokyo-60s-relax.mp4",
          "poster": "assets/posters/comparison-tokyo-60s-relax.jpg",
          "duration": 60.5625,
          "firstSteps": 4
        }
      ],
      "sampling": "One-step comparison \u00b7 First 4 / Rest 1",
      "note": ""
    }
  ],
  "gallery": [
    {
      "method": "Any Forcing",
      "src": "assets/videos/extended-iceberg-first4-rest1.mp4",
      "poster": "assets/posters/extended-iceberg-first4-rest1.jpg",
      "duration": 60.5625,
      "firstSteps": 4,
      "id": "extended-iceberg",
      "kind": "extended",
      "title": "Arctic iceberg",
      "prompt": "A large iceberg floating in the icy Arctic Ocean under a clear blue sky. The iceberg is massive, with jagged edges and smooth surfaces, showing various shades of blue and white due to compressed snow and ice. It has several crevices and cracks visible, adding to its dramatic appearance. The water around the iceberg is calm, reflecting the pristine beauty of the surrounding landscape. The camera captures the iceberg from a medium distance, providing a panoramic view of its towering presence amidst the vast ocean. Static scene, no camera movement.",
      "restSteps": 1,
      "nfe": "star",
      "label": "First 4 / Rest 1",
      "note": ""
    },
    {
      "method": "Any Forcing",
      "src": "assets/videos/extended-fluffy-monster-first4-rest1.mp4",
      "poster": "assets/posters/extended-fluffy-monster-first4-rest1.jpg",
      "duration": 60.5625,
      "firstSteps": 4,
      "id": "extended-fluffy-monster",
      "kind": "extended",
      "title": "A curious little monster",
      "prompt": "A close-up 3D animated scene of a short, fluffy monster kneeling beside a melting red candle. The monster has large, wide eyes and an open mouth, gazing at the flame with a look of wonder and curiosity. Its soft, fluffy fur contrasts with the warm, dramatic lighting that highlights every detail of its gentle, innocent expression. The pose conveys a sense of playfulness and exploration, as if the creature is discovering the world for the first time. The background features a cozy, warmly lit room with subtle hints of a fireplace and soft furnishings, enhancing the overall atmosphere. The use of warm colors and dramatic lighting creates a captivating and inviting scene.",
      "restSteps": 1,
      "nfe": "star",
      "label": "First 4 / Rest 1",
      "note": ""
    }
  ],
  "shortGallery": [
    {
      "id": "panda",
      "title": "Coffee in Paris",
      "kind": "short",
      "prompt": "An animated scene of a panda drinking coffee in a cozy caf\u00e9 in Paris. The panda is sitting at a small table with a steaming cup of coffee, holding a spoon delicately. The caf\u00e9 has vintage decor with wooden furniture, soft lighting, and a few other patrons in the background. The panda has a relaxed and content expression, sipping the coffee slowly. The atmosphere is warm and inviting, with the soft hum of conversation in the background. Medium shot focusing on the panda and the coffee cup.",
      "sample": 0,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-panda-first2-rest1.mp4",
          "poster": "assets/posters/sampling-panda-first2-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-panda-uniform2.mp4",
          "poster": "assets/posters/sampling-panda-uniform2.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 2,
          "schedule": "uniform2",
          "label": "Uniform 2 steps",
          "nfe": "2"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-panda-first4-rest1.mp4",
          "poster": "assets/posters/sampling-panda-first4-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-panda-uniform4.mp4",
          "poster": "assets/posters/sampling-panda-uniform4.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 4,
          "schedule": "uniform4",
          "label": "Uniform 4 steps",
          "nfe": "4"
        }
      ],
      "sourcePrompt": "A panda drinking coffee in a cafe in Paris, animated style",
      "promptLine": 527,
      "promptOrigin": "paired_files"
    },
    {
      "id": "astronaut",
      "title": "Drifting through space",
      "kind": "short",
      "prompt": "Astronaut floating in the vast expanse of space in super slow motion. The astronaut is wearing a full-body spacesuit with reflective gold visor, and is performing a gentle rotation while slowly moving towards the camera. The background showcases the distant Earth with swirling clouds and patches of blue oceans, alongside stars and galaxies in the blackness of space. The scene captures the serene beauty and tranquility of space exploration. Static shot, focusing on the smooth, slow motion of the astronaut.",
      "sample": 0,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-astronaut-first2-rest1.mp4",
          "poster": "assets/posters/sampling-astronaut-first2-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-astronaut-uniform2.mp4",
          "poster": "assets/posters/sampling-astronaut-uniform2.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 2,
          "schedule": "uniform2",
          "label": "Uniform 2 steps",
          "nfe": "2"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-astronaut-first4-rest1.mp4",
          "poster": "assets/posters/sampling-astronaut-first4-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-astronaut-uniform4.mp4",
          "poster": "assets/posters/sampling-astronaut-uniform4.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 4,
          "schedule": "uniform4",
          "label": "Uniform 4 steps",
          "nfe": "4"
        }
      ],
      "sourcePrompt": "An astronaut flying in space, in super slow motion",
      "promptLine": 664,
      "promptOrigin": "paired_files"
    },
    {
      "id": "lanterns",
      "title": "Lantern-lit old city",
      "kind": "short",
      "prompt": "A still frame captures the heart of an old city at night, where a row of ornate lantern-style street lamps illuminates a narrow alleyway in a warm, welcoming glow. The street lamps are tall and elegant, with intricate designs and soft, amber-colored lights. The alleyway is lined with weathered brick walls and cobblestone pavement, creating a cozy and intimate atmosphere. Shadows play across the textured surfaces, adding depth and character to the scene. The camera is positioned at a medium shot, focusing on the interplay of light and shadow within the confined space, emphasizing the serene and nostalgic ambiance.",
      "sample": 1,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-lanterns-first2-rest1.mp4",
          "poster": "assets/posters/sampling-lanterns-first2-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-lanterns-uniform2.mp4",
          "poster": "assets/posters/sampling-lanterns-uniform2.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 2,
          "schedule": "uniform2",
          "label": "Uniform 2 steps",
          "nfe": "2"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-lanterns-first4-rest1.mp4",
          "poster": "assets/posters/sampling-lanterns-first4-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-lanterns-uniform4.mp4",
          "poster": "assets/posters/sampling-lanterns-uniform4.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 4,
          "schedule": "uniform4",
          "label": "Uniform 4 steps",
          "nfe": "4"
        }
      ],
      "sourcePrompt": "In a still frame, in the heart of the old city, a row of ornate lantern-style streetlamps bathed the narrow alleyway in a warm, welcoming light",
      "promptLine": 62,
      "promptOrigin": "paired_files"
    },
    {
      "id": "coast",
      "title": "Spring coastline",
      "kind": "short",
      "prompt": "A serene coastal beach in spring, showcasing a picturesque blend of golden sand and crystal-clear turquoise waters. Gentle waves lap at the shore, creating a soothing rhythm. In the foreground, palm trees sway gently in the breeze, their leaves casting dappled shadows on the sand. The sky is a soft pastel shade of blue, with wisps of clouds drifting lazily across. A steady and smooth perspective captures the tranquil beauty of the beach, focusing on the interplay between the water and the sandy shoreline. Wide shot, maintaining a static viewpoint to emphasize the peaceful atmosphere.",
      "sample": 0,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-coast-first2-rest1.mp4",
          "poster": "assets/posters/sampling-coast-first2-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-coast-uniform2.mp4",
          "poster": "assets/posters/sampling-coast-uniform2.jpg",
          "duration": 5.0625,
          "firstSteps": 2,
          "restSteps": 2,
          "schedule": "uniform2",
          "label": "Uniform 2 steps",
          "nfe": "2"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-coast-first4-rest1.mp4",
          "poster": "assets/posters/sampling-coast-first4-rest1.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star"
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-coast-uniform4.mp4",
          "poster": "assets/posters/sampling-coast-uniform4.jpg",
          "duration": 5.0625,
          "firstSteps": 4,
          "restSteps": 4,
          "schedule": "uniform4",
          "label": "Uniform 4 steps",
          "nfe": "4"
        }
      ],
      "sourcePrompt": "A beautiful coastal beach in spring, waves lapping on sand, featuring a steady and smooth perspective",
      "promptLine": 592,
      "promptOrigin": "paired_files"
    }
  ],
  "longGallery": [
    {
      "id": "cyberpunk-coast",
      "title": "Cyberpunk coastline",
      "kind": "long",
      "prompt": "In a cyberpunk-themed coastal beach during spring, the sun sets over a futuristic horizon, casting a neon glow over the scene. Waves gently lap against the sandy shore, reflecting the vibrant hues of the city lights and holographic advertisements above. The beach is lined with sleek, metallic structures and glowing billboards. In the foreground, the sand is dotted with scattered debris and discarded technology. The water appears dark and mysterious, with occasional reflections of the surrounding cybernetic architecture. Medium shot capturing the interplay between nature and technology.",
      "promptOrigin": "paired_files",
      "differentSamples": false,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-cyberpunk-coast-first2-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-cyberpunk-coast-first2-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger",
          "sample": 1
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-cyberpunk-coast-first4-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-cyberpunk-coast-first4-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star",
          "sample": 1
        }
      ],
      "sourcePrompt": "A beautiful coastal beach in spring, waves lapping on sand, in cyberpunk style",
      "promptLine": 499
    },
    {
      "id": "bird-cat",
      "title": "A bird and a cat",
      "kind": "long",
      "prompt": "A front-view close-up of a cat on the right and a bird on the left. The cat is sitting upright with its ears perked up, and the bird is perched on a branch just beside the cat. Both animals are facing forward, looking directly at the camera. The cat has a curious expression, while the bird appears alert and cautious. The background is a blurred green environment, suggesting a garden or forest setting. The focus should be on the interaction between the two animals, emphasizing their body postures and expressions.",
      "promptOrigin": "paired_files",
      "differentSamples": false,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-bird-cat-first2-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-bird-cat-first2-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger",
          "sample": 1
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-bird-cat-first4-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-bird-cat-first4-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star",
          "sample": 1
        }
      ],
      "sourcePrompt": "a bird on the left of a cat, front view",
      "promptLine": 873
    },
    {
      "id": "llama-cafe",
      "title": "Coding in a cozy cafe",
      "kind": "long",
      "prompt": "A digital illustration in a whimsical cartoon style of a llama coding and typing on his laptop in a cozy cafe. The llama has a friendly expression, with large, expressive eyes and a gentle smile. It wears a colorful patterned scarf and a pair of round glasses perched on its nose. The cafe setting includes a wooden table, a few chairs, and a window with a view of a bustling street outside. The background is filled with the soft glow of ambient lighting and hints of other patrons. The llama's fingers dance over the keyboard, with a cup of steaming coffee nearby. A close-up shot from a slightly elevated angle, capturing the llama's focused and engaged posture.",
      "promptOrigin": "custom",
      "differentSamples": false,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-llama-cafe-first2-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-llama-cafe-first2-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger",
          "sample": null
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-llama-cafe-first4-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-llama-cafe-first4-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star",
          "sample": null
        }
      ],
      "promptLine": null
    },
    {
      "id": "astronaut-surrealism",
      "title": "Surreal astronaut",
      "showSampleLabels": false,
      "kind": "long",
      "prompt": "Surrealism style, an astronaut floating weightlessly in the vast expanse of space. The astronaut wears a bulky white spacesuit with reflective surfaces and glowing control panels. They have a serene expression with their helmet visor reflecting distant stars and galaxies. Long, ethereal strands of fabric or light trail behind them, creating a dreamlike effect. The background showcases an abstract blend of swirling cosmic dust, nebulae, and distant celestial bodies. The scene is captured in a mid-shot, emphasizing the astronaut's peaceful interaction with the surreal environment.",
      "promptOrigin": "paired_files",
      "differentSamples": true,
      "videos": [
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-astronaut-surrealism-first2-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-astronaut-surrealism-first2-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 2,
          "restSteps": 1,
          "schedule": "first2-rest1",
          "label": "First 2 / Rest 1",
          "nfe": "dagger",
          "sample": 2
        },
        {
          "method": "Any Forcing",
          "src": "assets/videos/sampling-long-astronaut-surrealism-first4-rest1-web-v3.mp4",
          "poster": "assets/posters/sampling-long-astronaut-surrealism-first4-rest1-web-v3.jpg",
          "duration": 30.3125,
          "firstSteps": 4,
          "restSteps": 1,
          "schedule": "first4-rest1",
          "label": "First 4 / Rest 1",
          "nfe": "star",
          "sample": 1
        }
      ],
      "sourcePrompt": "An astronaut flying in space, surrealism style",
      "promptLine": 574
    }
  ]
};
