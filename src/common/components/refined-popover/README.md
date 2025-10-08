# RefinedPopover

A refined, elegant popover component designed with a quiet and gentle aesthetic that matches the project's overall design philosophy.

## Design Philosophy

- **Quiet & Gentle**: Uses subtle colors and minimal visual noise
- **Professional**: Clean, modern design suitable for business applications
- **Consistent**: Unified design language across all popover instances
- **Accessible**: Proper focus management and keyboard navigation

## Features

- **Compound Component Pattern**: Flexible composition using namespace organization
- **Responsive Design**: Adapts to different content sizes
- **Dark Mode Support**: Seamless dark/light theme switching
- **Customizable**: Easy to extend and modify for specific use cases
- **TypeScript Support**: Full type safety and IntelliSense

## Usage

### Basic Structure

```tsx
import { RefinedPopover } from "@/common/components/refined-popover";

<RefinedPopover>
  <RefinedPopover.Trigger>
    <Button>Open Popover</Button>
  </RefinedPopover.Trigger>
  
  <RefinedPopover.Content>
    <RefinedPopover.Header>
      <h3>Title</h3>
      <p>Description</p>
    </RefinedPopover.Header>
    
    <RefinedPopover.Body>
      <div>Main content goes here</div>
    </RefinedPopover.Body>
    
    <RefinedPopover.Actions>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </RefinedPopover.Actions>
  </RefinedPopover.Content>
</RefinedPopover>
```

### Controlled State

```tsx
const [isOpen, setIsOpen] = useState(false);

<RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
  {/* ... content ... */}
</RefinedPopover>
```

### Custom Width

```tsx
<RefinedPopover.Content width="w-96">
  {/* ... content ... */}
</RefinedPopover.Content>
```

## API Reference

### RefinedPopover (Root)

The main container component that wraps the entire popover.

**Props:**
- `children`: ReactNode - The popover content
- `open?`: boolean - Controlled open state
- `onOpenChange?`: (open: boolean) => void - Callback when open state changes

### RefinedPopover.Trigger

The element that triggers the popover to open.

**Props:**
- `children`: ReactNode - The trigger element
- `asChild?`: boolean - Whether to render as a child element

### RefinedPopover.Content

The styled content wrapper with consistent styling.

**Props:**
- `children`: ReactNode - The popover content
- `width?`: string - Custom width class (default: "w-88")
- `className?`: string - Additional CSS classes

### RefinedPopover.Header

The header section with subtle background and border.

**Props:**
- `children`: ReactNode - Header content
- `className?`: string - Additional CSS classes

### RefinedPopover.Body

The main content area with consistent spacing.

**Props:**
- `children`: ReactNode - Body content
- `className?`: string - Additional CSS classes

### RefinedPopover.Actions

The action buttons area with proper alignment and spacing.

**Props:**
- `children`: ReactNode - Action buttons
- `className?`: string - Additional CSS classes

## Styling

### Default Classes

The component uses a consistent set of Tailwind CSS classes:

- **Container**: `border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-white dark:bg-slate-900 rounded-xl`
- **Header**: `px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30`
- **Body**: `px-5 pt-5 pb-0 space-y-5`
- **Actions**: `px-5 pb-5 pt-2 flex items-center justify-end gap-3`

### Customization

You can override any styling by passing `className` props to individual components:

```tsx
<RefinedPopover.Header className="bg-blue-50 border-blue-200">
  <h3 className="text-blue-900">Custom Header</h3>
</RefinedPopover.Header>
```

## Examples

### Form Popover

```tsx
<RefinedPopover>
  <RefinedPopover.Trigger>
    <Button variant="outline">Edit Settings</Button>
  </RefinedPopover.Trigger>
  
  <RefinedPopover.Content>
    <RefinedPopover.Header>
      <SlidersHorizontal className="w-4 h-4 text-primary/80" />
      <div className="text-sm font-semibold text-foreground/90">Edit Settings</div>
    </RefinedPopover.Header>
    
    <RefinedPopover.Body>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Enter name..." />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input placeholder="Enter description..." />
        </div>
      </div>
    </RefinedPopover.Body>
    
    <RefinedPopover.Actions>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </RefinedPopover.Actions>
  </RefinedPopover.Content>
</RefinedPopover>
```

### Information Popover

```tsx
<RefinedPopover>
  <RefinedPopover.Trigger>
    <InfoIcon className="w-4 h-4 text-slate-400" />
  </RefinedPopover.Trigger>
  
  <RefinedPopover.Content width="w-80">
    <RefinedPopover.Header>
      <h3 className="text-base font-medium">Help Information</h3>
    </RefinedPopover.Header>
    
    <RefinedPopover.Body>
      <p className="text-sm text-slate-600">
        This feature allows you to organize your thoughts into dedicated spaces.
      </p>
    </RefinedPopover.Body>
  </RefinedPopover.Content>
</RefinedPopover>
```

## Best Practices

1. **Consistent Structure**: Always use the same component hierarchy for similar popovers
2. **Appropriate Sizing**: Use `w-88` for forms, `w-80` for information, `w-96` for complex content
3. **Clear Headers**: Provide descriptive titles and subtitles
4. **Logical Actions**: Place primary actions on the right, secondary actions on the left
5. **Keyboard Support**: Ensure all interactive elements are keyboard accessible

## Accessibility

- Proper ARIA attributes through underlying Popover component
- Keyboard navigation support (Escape to close, Tab for focus management)
- Focus trapping within the popover content
- Screen reader friendly structure

## Performance

- Minimal re-renders through efficient state management
- Lightweight styling with Tailwind CSS
- No unnecessary DOM manipulation
- Optimized for smooth animations and transitions
