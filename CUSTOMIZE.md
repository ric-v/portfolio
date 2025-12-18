# Portfolio Template Customization Guide

This portfolio is designed to be easily customizable via a single configuration file. You don't need to touch the code to update your personal information, projects, or theme.

## 🚀 Quick Start

1.  Open `src/config/portfolio.ts`.
2.  Update the `portfolioConfig` object with your details.
3.  Save the file. The changes will reflect immediately.

## 📝 Configuration Options

### Personal Information
Update the `personalInfo` section with your name, role, bio, and social links.

```typescript
personalInfo: {
  name: "Your Name",
  role: "Your Role (e.g., Creative Developer)",
  description: "A short description for SEO",
  bio: [
    "First paragraph of your bio.",
    "Second paragraph...",
  ],
  quote: "Your favorite quote or tagline",
  // ...
}
```

### Hero Section
Customize the rotating text in the hero section by updating `hero.carouselItems`. Each item has a `headline` and `subtext`.

### Projects
Add or remove projects in the `projects` array.

```typescript
projects: [
  {
    id: 1,
    title: "Project Name",
    description: "Short description",
    tags: ["Tech 1", "Tech 2"],
    image: "/path/to/image.jpg", // Place images in the public/ folder
    link: "https://project-url.com",
  },
  // ...
]
```

### Images
1.  Place your images in the `public/` folder.
2.  Reference them in the config file (e.g., `/my-photo.png`).
3.  For the profile picture, you can provide different versions for light and dark mode if desired.

## 🎨 Advanced Customization

### Theming
The visual theme is controlled by `tailwind.config.ts` and `src/app/globals.css`.
-   **Colors**: Update the CSS variables in `globals.css` to change the color scheme.
-   **Fonts**: The project uses `Geist Sans` and `Geist Mono` by default. You can change this in `src/app/layout.tsx`.

### Adding New Sections
If you want to add new sections (e.g., a "Blog" section):
1.  Create a new component in `src/components/sections/`.
2.  Add it to `src/app/page.tsx`.
3.  Add necessary data to `src/config/portfolio.ts` and update the `PortfolioConfig` interface.
