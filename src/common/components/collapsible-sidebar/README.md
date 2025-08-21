# CollapsibleSidebar Component

A reusable React component that provides a collapsible sidebar with smooth animations, floating expand button, and namespace-based compound component architecture.

## Features

- ✨ **Smooth Animations**: CSS transitions for width, opacity, and button transitions
- 🎯 **Dual Control**: Internal collapse button and floating expand button
- 🎨 **Highly Customizable**: Configurable width, styling, and behavior
- 📱 **Responsive Design**: Adapts to different screen sizes
- 🌙 **Theme Support**: Built-in dark/light theme support
- 🔄 **State Callback**: Optional callback for state changes
- 🧩 **Compound Components**: Namespace-based API for flexible composition
- ⚡ **Context Communication**: Internal state sharing via React Context

## Installation

The component is already included in the project. Import it from:

```tsx
import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
```

## Basic Usage

### Simple Sidebar

```tsx
import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";

function MyLayout() {
    return (
        <div className="flex h-screen">
            <CollapsibleSidebar>
                <CollapsibleSidebar.Header>
                    <h3>Navigation</h3>
                    <CollapsibleSidebar.ToggleButton />
                </CollapsibleSidebar.Header>
                <CollapsibleSidebar.Content>
                    <nav>
                        <a href="/dashboard">Dashboard</a>
                        <a href="/settings">Settings</a>
                        <a href="/profile">Profile</a>
                    </nav>
                </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            
            <main className="flex-1 p-4">
                Main content area
            </main>
        </div>
    );
}
```

### Without Header (Content Only)

```tsx
<CollapsibleSidebar>
    <CollapsibleSidebar.Content>
        {/* Your existing sidebar content */}
        <YourExistingSidebarComponent />
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>
```

## API Reference

### CollapsibleSidebar (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Child components (Header, Content, etc.) |
| `width` | `string` | `"w-80"` | Tailwind CSS class for expanded sidebar width |
| `collapsedWidth` | `string` | `"w-0"` | Tailwind CSS class for collapsed sidebar width |
| `className` | `string` | `""` | Additional CSS classes for the sidebar container |
| `onCollapseChange` | `(collapsed: boolean) => void` | `undefined` | Callback when collapse state changes |

### CollapsibleSidebar.Header

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Header content |
| `className` | `string` | `""` | Additional CSS classes for the header |

### CollapsibleSidebar.ToggleButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes for the button |
| `children` | `ReactNode` | `<PanelLeft />` | Custom button content (icon, text, etc.) |

### CollapsibleSidebar.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Content to render inside the sidebar |
| `className` | `string` | `""` | Additional CSS classes for the content area |

### useCollapsibleSidebar Hook

```tsx
const { isCollapsed, toggleCollapse } = useCollapsibleSidebar();
```

| Property | Type | Description |
|----------|------|-------------|
| `isCollapsed` | `boolean` | Current collapsed state |
| `toggleCollapse` | `() => void` | Function to toggle collapse state |

## Advanced Examples

### Custom Width and Styling

```tsx
<CollapsibleSidebar 
    width="w-96"
    collapsedWidth="w-0"
    className="bg-blue-50 border-blue-200"
>
    <CollapsibleSidebar.Header className="bg-blue-100">
        <h3 className="text-blue-700">Custom Sidebar</h3>
        <CollapsibleSidebar.ToggleButton />
    </CollapsibleSidebar.Header>
    <CollapsibleSidebar.Content className="bg-blue-50">
        Custom styled content
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>
```

### With State Callback

```tsx
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

<CollapsibleSidebar 
    onCollapseChange={(collapsed) => {
        setSidebarCollapsed(collapsed);
        // Sync with parent component state
        // or trigger other actions
    }}
>
    <CollapsibleSidebar.Content>
        Sidebar content
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>
```

### Custom Toggle Button

```tsx
<CollapsibleSidebar.Header>
    <h3>My App</h3>
    <CollapsibleSidebar.ToggleButton>
        <CustomIcon className="w-4 h-4" />
    </CollapsibleSidebar.ToggleButton>
</CollapsibleSidebar.Header>
```

### Using the Hook in Child Components

```tsx
function MyCustomSidebarContent() {
    const { isCollapsed, toggleCollapse } = useCollapsibleSidebar();
    
    return (
        <div>
            <p>Sidebar is {isCollapsed ? 'collapsed' : 'expanded'}</p>
            <button onClick={toggleCollapse}>
                Toggle from inside content
            </button>
        </div>
    );
}
```

## Styling Guide

### Default Styling

The component uses these default Tailwind classes:

- **Container**: `bg-slate-50 dark:bg-slate-800`
- **Border**: `border-slate-200 dark:border-slate-700`
- **Header**: `p-3 border-b`
- **Content**: `flex-1`
- **Transitions**: `duration-300 ease-in-out`

### Common Width Classes

- `w-64` - 256px (narrow)
- `w-80` - 320px (default)
- `w-96` - 384px (wide)
- `w-[400px]` - Custom width (400px)
- `w-0` - 0px (collapsed)

### Layout Considerations

1. **Parent Container**: Must have `relative` positioning for floating button
2. **Height**: Sidebar takes full height of its container
3. **Flex Layout**: Internal components use flexbox for proper spacing
4. **Z-Index**: Floating button uses `z-10` to appear above content

## Animation Details

### Sidebar Animation
- **Duration**: 300ms
- **Easing**: `ease-in-out`
- **Properties**: Width and opacity

### Button Transitions
- **Toggle Button**: Fades out with scale effect during collapse
- **Expand Button**: Slides in from left with fade effect
- **Duration**: 300ms (synchronized with sidebar)

### CSS Classes Used
```css
/* Sidebar container */
.transition-all.duration-300.ease-in-out

/* Toggle button states */
.opacity-0.scale-95        /* Collapsed state */
.opacity-100.scale-100     /* Expanded state */

/* Expand button entrance */
.animate-in.fade-in.slide-in-from-left-2.duration-300
```

## Best Practices

### 1. Container Setup
```tsx
// ✅ Correct: Parent has relative positioning
<div className="flex h-screen relative">
    <CollapsibleSidebar>...</CollapsibleSidebar>
    <main className="flex-1">...</main>
</div>
```

### 2. Content Organization
```tsx
// ✅ Recommended: Use Header + Content pattern
<CollapsibleSidebar>
    <CollapsibleSidebar.Header>
        <h3>Title</h3>
        <CollapsibleSidebar.ToggleButton />
    </CollapsibleSidebar.Header>
    <CollapsibleSidebar.Content>
        {/* Your content */}
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>

// ✅ Also valid: Content only
<CollapsibleSidebar>
    <CollapsibleSidebar.Content>
        {/* Content with integrated toggle */}
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>
```

### 3. State Management
```tsx
// ✅ Good: Use callback for external state sync
<CollapsibleSidebar onCollapseChange={handleCollapseChange}>
    {/* ... */}
</CollapsibleSidebar>

// ✅ Good: Use hook for internal communication
const { isCollapsed } = useCollapsibleSidebar();
```

### 4. Responsive Design
```tsx
// ✅ Consider mobile behavior
<CollapsibleSidebar 
    width="w-80 md:w-64" 
    className="md:relative md:translate-x-0"
>
    {/* ... */}
</CollapsibleSidebar>
```

## Troubleshooting

### Common Issues

1. **Floating button not visible**
   - Ensure parent container has `relative` positioning
   - Check z-index conflicts

2. **Content not expanding**
   - Verify `CollapsibleSidebar.Content` uses `flex-1`
   - Check parent container uses flex layout

3. **Animation not smooth**
   - Ensure Tailwind CSS transitions are loaded
   - Check for CSS conflicts

4. **Hook errors**
   - `useCollapsibleSidebar` must be used within `CollapsibleSidebar`
   - Verify component hierarchy

### Performance Tips

- Use `React.memo` for expensive child components
- Avoid complex calculations in `onCollapseChange`
- Consider using `useCallback` for event handlers

## Integration Examples

### With React Router

```tsx
function AppLayout() {
    return (
        <div className="flex h-screen relative">
            <CollapsibleSidebar>
                <CollapsibleSidebar.Header>
                    <h3>Navigation</h3>
                    <CollapsibleSidebar.ToggleButton />
                </CollapsibleSidebar.Header>
                <CollapsibleSidebar.Content>
                    <nav>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/users">Users</NavLink>
                        <NavLink to="/settings">Settings</NavLink>
                    </nav>
                </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
```

### With Existing Components

```tsx
// Wrapping existing sidebar component
<CollapsibleSidebar>
    <CollapsibleSidebar.Content>
        <ExistingSidebarComponent />
    </CollapsibleSidebar.Content>
</CollapsibleSidebar>

// Adding toggle to existing header
<ExistingSidebarHeader>
    <h3>Existing Title</h3>
    <CollapsibleSidebar.ToggleButton />
</ExistingSidebarHeader>
```

## Dependencies

- React 18+
- Tailwind CSS
- Lucide React (for icons)
- `@/common/lib/utils` (for `cn` utility)
- `@/common/components/ui/button` (shadcn/ui button)

## Contributing

When contributing to this component:

1. Maintain backward compatibility
2. Update examples when adding new features
3. Ensure TypeScript types are complete
4. Test with both light and dark themes
5. Verify animations work smoothly
6. Update this README for any API changes

## License

This component is part of the EchoNote project and follows the same licensing terms.
