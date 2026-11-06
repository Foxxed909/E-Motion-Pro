// Metadata for every motion piece. Components live in ./pieces and are loaded
// lazily through ./components.tsx so pages only ship the code they show.

export type GenreId =
  | "typography"
  | "transitions"
  | "micro"
  | "app"
  | "scroll"
  | "shader"
  | "particles"
  | "depth"
  | "loaders"
  | "retro"
  | "data"
  | "organic"
  | "editorial";

export type Genre = { id: GenreId; name: string; font: string; line: string };

export const GENRES: Genre[] = [
  { id: "typography", name: "Kinetic Type", font: "velocity", line: "Letters that refuse to sit still." },
  { id: "transitions", name: "Page Transitions", font: "monolith", line: "The moment between two moments." },
  { id: "micro", name: "Micro-interactions", font: "bubblegum", line: "Tiny feedback, enormous feeling." },
  { id: "app", name: "App UI", font: "orbit", line: "Native-grade motion for product surfaces." },
  { id: "scroll", name: "Scroll Stories", font: "spindle", line: "Narratives scrubbed by your thumb." },
  { id: "shader", name: "Shaders", font: "neon", line: "Pixels computed, never drawn." },
  { id: "particles", name: "Particles & Physics", font: "constellation", line: "Thousands of points, one behaviour." },
  { id: "depth", name: "3D & Depth", font: "autobahn", line: "Perspective, parallax and light." },
  { id: "loaders", name: "Loaders", font: "telegraph", line: "Making waiting feel like a feature." },
  { id: "retro", name: "Retro & Glitch", font: "datamosh", line: "Nostalgia with corrupted memory." },
  { id: "data", name: "Data in Motion", font: "barcode", line: "Numbers that perform." },
  { id: "organic", name: "Organic & Liquid", font: "inkwell", line: "Soft bodies, gooey edges." },
  { id: "editorial", name: "Editorial", font: "opera", line: "Swiss grids with a pulse." },
];

export type Demo = {
  slug: string;
  title: string;
  genre: GenreId;
  blurb: string;
  tags: string[];
  /** Background tone of the stage. */
  tone: string;
  /** Interaction hint shown on the detail page. */
  hint?: string;
};

export const DEMOS: Demo[] = [
  // Kinetic type
  { slug: "text-path", title: "Type on a Path", genre: "typography", blurb: "Words surfing living sine waves and a spinning badge.", tags: ["svg", "textPath"], tone: "#0b0b10" },
  { slug: "font-roulette", title: "Font Roulette", genre: "typography", blurb: "Every glyph spins through all 30 E-Motion Pro typefaces before landing.", tags: ["type", "custom fonts"], tone: "#0b0b0f", hint: "Hover the word to re-roll" },
  { slug: "split-reveal", title: "Split Reveal", genre: "typography", blurb: "Character-level masked reveals with rotational overshoot, looping through headlines.", tags: ["stagger", "mask"], tone: "#ff4f2e" },
  { slug: "decoder", title: "Decoder", genre: "typography", blurb: "Phrases resolve out of cipher noise, glyph by glyph.", tags: ["scramble", "mono"], tone: "#050505" },
  { slug: "magnetic-type", title: "Magnetic Type", genre: "typography", blurb: "Letters repel from the cursor on springs, then snap home.", tags: ["physics", "pointer"], tone: "#d4ff3a", hint: "Sweep your pointer through the letters" },
  { slug: "velocity-marquee", title: "Velocity Marquee", genre: "typography", blurb: "Counter-scrolling bands that skew and accelerate with pointer speed.", tags: ["marquee", "skew"], tone: "#120d1f", hint: "Move fast across the stage" },

  // Transitions
  { slug: "slice-swipe", title: "Slice Swipe", genre: "transitions", blurb: "The outgoing page shatters into skewed slices that fly apart.", tags: ["clip-path", "stagger"], tone: "#0b0b0b" },
  { slug: "menu-takeover", title: "Menu Takeover", genre: "transitions", blurb: "A tiny button bursts into a full-screen menu with staggered links.", tags: ["clip-path", "menu"], tone: "#e9e5dd", hint: "Tap the button" },
  { slug: "curtain-wipe", title: "Curtain Wipe", genre: "transitions", blurb: "Staggered panels sweep across a mock site between routes.", tags: ["route", "stagger"], tone: "#111" },
  { slug: "circle-portal", title: "Circle Portal", genre: "transitions", blurb: "The next page grows out of exactly where you clicked.", tags: ["clip-path", "pointer"], tone: "#0d0d12", hint: "Click anywhere" },
  { slug: "pixel-dissolve", title: "Pixel Dissolve", genre: "transitions", blurb: "A grid of tiles flips in a diagonal wave to swap scenes.", tags: ["grid", "wave"], tone: "#08080a" },
  { slug: "shared-zoom", title: "Shared Zoom", genre: "transitions", blurb: "Cards morph seamlessly into full-bleed detail views.", tags: ["layout", "shared element"], tone: "#f3efe7", hint: "Open a card" },

  // Micro
  { slug: "spotlight-cards", title: "Spotlight Cards", genre: "micro", blurb: "A shared light source that glows through every card border.", tags: ["gradient", "pointer"], tone: "#08080b", hint: "Move across the grid" },
  { slug: "liquid-buttons", title: "Liquid Buttons", genre: "micro", blurb: "Magnetic pills with fills that pour in from the pointer's entry point.", tags: ["buttons", "magnetic"], tone: "#0d0d0d", hint: "Hover and press" },
  { slug: "morph-toggles", title: "Morph Toggles", genre: "micro", blurb: "Day/night switch, heart burst and self-drawing checkbox.", tags: ["svg", "spring"], tone: "#1a1530", hint: "Tap everything" },
  { slug: "submit-flow", title: "Submit Flow", genre: "micro", blurb: "A button that becomes a loader, then a triumphant check.", tags: ["state", "morph"], tone: "#0e1512", hint: "Press send" },
  { slug: "elastic-slider", title: "Elastic Slider", genre: "micro", blurb: "Rubber-band overscroll and a rolling odometer readout.", tags: ["drag", "odometer"], tone: "#101014", hint: "Drag past the edges" },

  // App UI
  { slug: "dynamic-pill", title: "Dynamic Pill", genre: "app", blurb: "A system island morphing between call, music and timer states.", tags: ["morph", "layout"], tone: "#e9e5dd" },
  { slug: "card-stack", title: "Card Stack", genre: "app", blurb: "Swipe-to-decide deck with rotation, velocity and spring return.", tags: ["drag", "gesture"], tone: "#141018", hint: "Fling a card" },
  { slug: "bottom-sheet", title: "Bottom Sheet", genre: "app", blurb: "Native-feeling sheet with detents and a receding backdrop.", tags: ["drag", "detents"], tone: "#0a0a0c", hint: "Drag the sheet" },
  { slug: "tab-morph", title: "Tab Morph", genre: "app", blurb: "A gooey indicator that flows between tabs.", tags: ["layoutId", "nav"], tone: "#ff5ca8" },
  { slug: "notification-stack", title: "Notification Stack", genre: "app", blurb: "Collapsed notifications fan open into a list.", tags: ["stack", "spring"], tone: "#202230", hint: "Hover the stack" },

  // Scroll
  { slug: "zoom-through", title: "Zoom Through", genre: "scroll", blurb: "Scroll flies the camera straight through a letterform into the next scene.", tags: ["svg mask", "scale"], tone: "#0b0b0b", hint: "Scroll inside" },
  { slug: "parallax-peaks", title: "Parallax Peaks", genre: "scroll", blurb: "Layered mountain ranges at different depths, scrubbed by scroll.", tags: ["parallax", "scroll"], tone: "#140c22", hint: "Scroll inside" },
  { slug: "stacking-cards", title: "Stacking Cards", genre: "scroll", blurb: "Sticky cards that stack and recede as new ones arrive.", tags: ["sticky", "scale"], tone: "#0c0c0c", hint: "Scroll inside" },
  { slug: "word-light", title: "Word Light", genre: "scroll", blurb: "A manifesto that illuminates word by word as you read.", tags: ["scrub", "opacity"], tone: "#0b0b0b", hint: "Scroll inside" },

  // Shaders
  { slug: "lava-lamp", title: "Lava Lamp", genre: "shader", blurb: "Smooth-min metaballs of glowing wax that rise, merge and split.", tags: ["glsl", "sdf"], tone: "#000", hint: "Your pointer is a blob" },
  { slug: "aurora", title: "Aurora", genre: "shader", blurb: "Domain-warped fractal noise painting curtains of polar light.", tags: ["glsl", "fbm"], tone: "#000", hint: "Move to bend the light" },
  { slug: "liquid-chrome", title: "Liquid Chrome", genre: "shader", blurb: "Molten metal surfaces with fake environment reflections.", tags: ["glsl", "metal"], tone: "#000" },
  { slug: "warp-tunnel", title: "Warp Tunnel", genre: "shader", blurb: "An infinite polar-coordinate tunnel at light speed.", tags: ["glsl", "polar"], tone: "#000", hint: "Steer with the pointer" },
  { slug: "plasma-orb", title: "Plasma Orb", genre: "shader", blurb: "A living sphere of electric plasma with rim light.", tags: ["glsl", "sdf"], tone: "#000" },
  { slug: "halftone-wave", title: "Halftone Wave", genre: "shader", blurb: "Print-style dot screens rippling like water.", tags: ["glsl", "halftone"], tone: "#000", hint: "Hover to drop ripples" },

  // Particles
  { slug: "verlet-rope", title: "Verlet Ropes", genre: "particles", blurb: "Hanging ropes simulated with Verlet integration. Push them around.", tags: ["canvas", "verlet"], tone: "#060609", hint: "Swing through the ropes" },
  { slug: "particle-type", title: "Particle Type", genre: "particles", blurb: "Thousands of particles assemble into words and scatter from your touch.", tags: ["canvas", "physics"], tone: "#050507", hint: "Disturb the particles" },
  { slug: "flow-field", title: "Flow Field", genre: "particles", blurb: "Agents tracing invisible currents into silk.", tags: ["canvas", "noise"], tone: "#07060a" },
  { slug: "constellation-net", title: "Constellation Net", genre: "particles", blurb: "Drifting nodes linking up when they get close.", tags: ["canvas", "graph"], tone: "#03040a", hint: "Your pointer is a star" },

  // Depth
  { slug: "infinite-canvas", title: "Infinite Canvas", genre: "depth", blurb: "A boundless, draggable wall of type specimens with inertia.", tags: ["drag", "wrap"], tone: "#060608", hint: "Drag in any direction" },
  { slug: "holo-card", title: "Holo Card", genre: "depth", blurb: "A foil trading card with tilt, glare and iridescent shift.", tags: ["3d", "tilt"], tone: "#0d0b14", hint: "Tilt the card" },
  { slug: "orbit-carousel", title: "Orbit Carousel", genre: "depth", blurb: "A 3D ring of panels you can spin with a drag.", tags: ["3d", "drag"], tone: "#0a0a0a", hint: "Drag to spin" },
  { slug: "exploded-ui", title: "Exploded UI", genre: "depth", blurb: "An interface separated into isometric layers.", tags: ["isometric", "layers"], tone: "#ecebe6" },

  // Loaders
  { slug: "skeleton-shimmer", title: "Skeleton Shimmer", genre: "loaders", blurb: "Shimmering placeholders resolve into real content with a stagger.", tags: ["skeleton", "stagger"], tone: "#0b0b10" },
  { slug: "gyroscope", title: "Gyroscope", genre: "loaders", blurb: "Nested 3D rings spinning on alternating axes around a glowing core.", tags: ["3d", "css"], tone: "#060608" },
  { slug: "loader-lab", title: "Loader Lab", genre: "loaders", blurb: "Nine original loaders in one grid.", tags: ["loop", "css"], tone: "#0c0c0f" },
  { slug: "liquid-progress", title: "Liquid Progress", genre: "loaders", blurb: "A vessel filling with sloshing liquid as progress climbs.", tags: ["svg", "wave"], tone: "#0b1020" },

  // Retro
  { slug: "split-flap", title: "Split-Flap", genre: "retro", blurb: "A departure board that flips every character into place.", tags: ["3d flip", "stagger"], tone: "#0b0b0b" },
  { slug: "rgb-glitch", title: "RGB Glitch", genre: "retro", blurb: "Channel-split title with slice displacement bursts.", tags: ["glitch", "css"], tone: "#000" },
  { slug: "crt-boot", title: "CRT Boot", genre: "retro", blurb: "A phosphor terminal booting with scanlines and flicker.", tags: ["terminal", "typing"], tone: "#020a04" },
  { slug: "synth-horizon", title: "Synth Horizon", genre: "retro", blurb: "An endless neon grid racing toward a striped sun.", tags: ["canvas", "80s"], tone: "#0d0221" },

  // Data
  { slug: "live-ticker", title: "Live Ticker", genre: "data", blurb: "A streaming chart whose price rolls digit by digit with the trend.", tags: ["svg", "realtime"], tone: "#0a0c0b" },
  { slug: "bar-race", title: "Bar Race", genre: "data", blurb: "A bar-chart race that reorders itself every year.", tags: ["layout", "race"], tone: "#0d0d10" },
  { slug: "chart-morph", title: "Chart Morph", genre: "data", blurb: "One dataset morphing between bars, line and radial views.", tags: ["svg", "morph"], tone: "#0d0d10" },
  { slug: "activity-rings", title: "Activity Rings", genre: "data", blurb: "Concentric progress rings with counting stats.", tags: ["svg", "count"], tone: "#000" },

  // Organic
  { slug: "liquid-text", title: "Liquid Text", genre: "organic", blurb: "Type melting through an animated turbulence displacement filter.", tags: ["svg filter", "turbulence"], tone: "#0b0b10", hint: "Hover to stir" },
  { slug: "dot-lens", title: "Dot Lens", genre: "organic", blurb: "A field of dots bulging and glowing under a moving lens.", tags: ["canvas", "lens"], tone: "#08070c", hint: "Glide over the dots" },
  { slug: "gooey-blobs", title: "Gooey Blobs", genre: "organic", blurb: "Metaball blobs that melt into each other and chase you.", tags: ["svg filter", "pointer"], tone: "#ff4f2e", hint: "Lead the blobs" },
  { slug: "blob-morph", title: "Blob Morph", genre: "organic", blurb: "Organic shapes breathing through endless mutations.", tags: ["svg", "path"], tone: "#0b0b10" },

  // Editorial
  { slug: "kinetic-poster", title: "Kinetic Poster", genre: "editorial", blurb: "A Swiss poster that re-composes its type and shapes to a beat.", tags: ["poster", "spring"], tone: "#1a1a1a" },
  { slug: "accordion-gallery", title: "Accordion Gallery", genre: "editorial", blurb: "Panels that expand on a spring while the rest fold into spines.", tags: ["flex", "hover"], tone: "#0b0b0b", hint: "Hover a panel" },
  { slug: "swiss-shuffle", title: "Swiss Shuffle", genre: "editorial", blurb: "A Bauhaus grid that reorganises itself to a beat.", tags: ["grid", "layout"], tone: "#f3efe7" },
  { slug: "hover-index", title: "Hover Index", genre: "editorial", blurb: "An editorial list with a floating preview chasing the cursor.", tags: ["list", "pointer"], tone: "#0b0b0b", hint: "Hover the list" },
];

export const demoBySlug = (slug: string) => DEMOS.find((d) => d.slug === slug);
export const genreById = (id: GenreId) => GENRES.find((g) => g.id === id)!;
export const demosInGenre = (id: GenreId) => DEMOS.filter((d) => d.genre === id);
