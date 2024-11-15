1. disable the codemirror outline this way: https://codemirror.net/examples/styling/
2. penweave logo, filename and username
3. https://medium.com/@yuvrajkakkar1/best-2024-top-20-visual-studio-code-extensions-for-react-js-developers-f3bfde74d4e2
4. code mirror lint : https://codemirror.net/examples/lint/
5. iframe security
6. lint and prettify codemirror using external library or codemirror
7. parse html so that no xss attack happen. use dom parser library
8. google gemini api integration to generate code
9. publicize, get liked and commented by others
10. share with others with sharable link. also download the whole code in one single file index.html
11. show the live render in a separate page and sharable link for its own as well
12. firebase backend for easy auth???
13. give warning that only content inside body tag goes there
14. prettify on save??? option for that
15. profile with avatar icon, contains my account option etc
16. only dark mode
17. vi bindings
18. codemirror and prettify tab width sync (2 or 4)
19. iframe sandboxing also dont show js in screen when html has open tags
20. split components
21.

````
src
   ├── App.tsx
   ├── assets
   │   └── images        # Store images, logos, icons, etc.
   ├── components
   │   ├── CodeEditor
   │   │   ├── CodeEditor.tsx
   │   │   ├── CodePlayground.tsx
   │   │   ├── CodeEditorGroup.tsx
   │   │   └── index.ts  # Barrel file for easy imports
   │   ├── ui
   │   │   ├── Button.tsx
   │   │   ├── DropdownMenu.tsx
   │   │   ├── Separator.tsx
   │   │   ├── Tabs.tsx
   │   │   └── index.ts  # Barrel file for easy imports
   │   └── PenWeaveIcon.tsx
   ├── contexts
   │   └── CodeContext.tsx
   ├── hooks
   │   ├── useCode.ts    # Custom hooks related to your code logic
   │   ├── useFirebase.ts # Custom hooks for Firebase interactions
   │   └── useTheme.ts   # Example: theme management, if any
   ├── layouts
   │   ├── MainLayout.tsx
   │   └── EditorLayout.tsx
   ├── lib
   │   ├── firebase.ts   # Firebase initialization & config
   │   ├── utils.ts
   │   └── constants.ts  # For storing app-wide constants
   ├── pages
   │   ├── Home.tsx
   │   ├── Editor.tsx
   │   └── NotFound.tsx
   ├── services
   │   └── firebaseService.ts # Encapsulate Firebase CRUD operations
   ├── styles
   │   ├── globals.css
   │   └── index.css
   ├── main.tsx
   ├── routes.tsx        # React Router configuration
   └── vite-env.d.ts
   ```

````

```

```
