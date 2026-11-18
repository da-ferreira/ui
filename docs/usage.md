# Usage

Requires React 19, Tailwind 4 and TypeScript. The examples use `npx`; `pnpm dlx`, `yarn dlx` and `bunx` work the same, and dependencies are installed with your project's manager (detected by the lockfile).

```bash
npx @davidalmeida/ui init          # imports the theme into your CSS and creates davidalmeida-ui.json
npx @davidalmeida/ui add button    # copies the component and the ones it uses; installs what is missing
npx @davidalmeida/ui list          # available components
npx @davidalmeida/ui diff [name]   # your copy × the package version
```

`init` takes `--dir=` (where components go, default `src/components/ui`) and `--css=` (the CSS with `@import 'tailwindcss'`). `add` takes `--all` and `--overwrite` (without it, a modified copy is never replaced).

Yarn 4 refuses versions published less than a day ago (`npmMinimalAgeGate`); right after a release, wait or use another manager.

## Texts

Built-in texts default to Brazilian Portuguese and are all props (`closeLabel`, `placeholder`, `todayLabel`, `toggleLabel`…). `DatePicker` takes a `locale` for dates and weekdays.

```tsx
<DatePicker
  aria-label="Start"
  value={from}
  onChange={setFrom}
  locale="en-US"
  placeholder="mm/dd/yyyy"
  todayLabel="Today"
/>
```

## Layout

`SidebarLayout` + `Sidebar*` build the app shell: the sidebar pushes the content from 1024px up and turns into a drawer below that. `SidebarItem` takes `as` for your router's link.

```tsx
<SidebarLayout
  navigationKey={pathname}
  header={<Breadcrumb />}
  sidebar={
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarNav>
        <SidebarSection title="Workspace">
          <SidebarItem as={Link} to="/" icon={<Home />} active={pathname === '/'}>
            Home
          </SidebarItem>
        </SidebarSection>
      </SidebarNav>
    </>
  }
>
  <Outlet />
</SidebarLayout>
```

## Theme

`@import '@davidalmeida/ui/tailwind.css'` brings the tokens (light and, with a `.dark` class on an ancestor, dark) and the utilities `bg-canvas`, `bg-surface`, `text-ink`, `text-dim`, `border-hairline`, `bg-brand`, `text-danger`… To change colors, redefine the variables after the import:

```css
:root {
  --brand: #7c3aed;
}
```

Fonts are Inter and IBM Plex Mono; load them in your project (e.g. Google Fonts).

## Theme toggle

`ThemeToggle` switches light / dark / system, toggles `.dark` on `<html>` and saves the choice in `localStorage` (`storageKey`, default `theme`). To avoid a flash on load, apply it before the first paint:

```html
<script>
  try {
    const t = localStorage.getItem('theme')
    if (t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark')
  } catch {}
</script>
```
