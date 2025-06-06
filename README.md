# FriendMap

A simple interactive tool to visualize your personal relationships as a network graph.

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)

## Features

- Add people to your network
- Create connections between people with bond strength
- Tag relationships (family, friends, work, etc.)
- Interactive graph visualization
- Filter by people, tags, or connection strength
- Data saved in browser storage

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## How to Use

1. **Add People**: Use the sidebar to add people to your network
2. **Create Connections**: Select two people and set their bond strength (0-100)
3. **Add Tags**: Categorize relationships with colored tags
4. **Filter**: Use filters to focus on specific parts of your network

## Tech Stack

- React with TypeScript
- Vite for development
- TailwindCSS for styling
- react-force-graph-2d for visualization

## Build for Production

```bash
npm run build
```
