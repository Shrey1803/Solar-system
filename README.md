
# 3D Solar System Simulation

A simple interactive 3D Solar System built with [Three.js](https://threejs.org/).

## Features

- Realistic Sun and 8 planets with textures
- Animated orbits (all orbits always visible)
- Tooltip with planet/Sun name on hover
- Top view camera button
- Pause/Resume animation
- Light/Dark mode toggle

## Getting Started

### 1. Clone or Download

Download or clone this repository to your local machine:

```sh
git clone https://github.com/Shrey1803/Solar-system.git
```

Or just download the files and place them in a folder.

### 2. Prepare Textures

Create a `textures` folder in your project directory and add these files (use NASA or [Solar System Scope Textures](https://www.solarsystemscope.com/textures/)):

- `2k_sun.jpg`
- `2k_stars_milky_way.jpg`
- `2k_mercury.jpg`
- `2k_venus_surface.jpg`
- `2k_earth_daymap.jpg`
- `2k_mars.jpg`
- `2k_jupiter.jpg`
- `2k_saturn.jpg`
- `2k_saturn_ring_alpha.jpg`
- `2k_uranus.jpg`
- `2k_neptune.jpg`

**The project will not work without these textures.**

### 3. Open in Your Browser

Just open `index.html` in your browser.  
No build step or server is required.

> **Tip:** For best results, use Chrome, Firefox, or Edge. If you see CORS errors, try running a simple local server (see below).

### 4. (Optional) Run a Local Server

If textures do not load (due to browser security restrictions), run a local server:

**Python 3:**
```sh
python -m http.server
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

**Node.js (http-server):**
```sh
npm install -g http-server
http-server
```

## Usage

- **Pause/Resume**: Click the "Pause" button.
- **Light/Dark Mode**: Click the "Light Mode"/"Dark Mode" button.
- **Top View**: Click "Top View" to see the solar system from above.
- **Tooltip**: Hover over a planet or the Sun to see its name.

## Project Structure

```
index.html
style.css
script.js
textures/
  2k_sun.jpg
  2k_stars_milky_way.jpg
  2k_mercury.jpg
  2k_venus_surface.jpg
  2k_earth_daymap.jpg
  2k_mars.jpg
  2k_jupiter.jpg
  2k_saturn.jpg
  2k_saturn_ring_alpha.jpg
  2k_uranus.jpg
  2k_neptune.jpg
```

## Credits

- [Three.js](https://threejs.org/)
- Textures from NASA/JPL or [Solar System Scope](https://www.solarsystemscope.com/textures/)

**Enjoy exploring the Solar System!**
