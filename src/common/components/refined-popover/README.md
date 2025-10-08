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
import { Plus } from "lucide-react";

<RefinedPopover>
  <RefinedPopover.Trigger>
    <Button>Open Popover</Button>
  </RefinedPopover.Trigger>
  
  <RefinedPopover.Content align="center" side="bottom">
    <RefinedPopover.Header>
      <Plus className="w-4 h-4 text-primary/80" />
      <div className="text-sm font-semibold text-foreground/90">Title</div>
    </RefinedPopover.Header>
    
    <RefinedPopover.Body>
      <div>Main content goes here</div>
    </RefinedPopover.Body>
    
    <RefinedPopover.Actions>
      <RefinedPopover.Button variant="outline">Cancel</RefinedPopover.Button>
      <RefinedPopover.Button variant="default">Save</RefinedPopover.Button>
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

The header section with icon and title in a clean, minimal style.

**Props:**
- `children`: ReactNode - Header content (typically an icon and title div)
- `className?`: string - Additional CSS classes

**Recommended Structure:**
```tsx
<RefinedPopover.Header>
  <IconComponent className="w-4 h-4 text-primary/80" />
  <div className="text-sm font-semibold text-foreground/90">Title</div>
  {/* Optional close button */}
  <RefinedPopover.Button
    variant="ghost"
    size="sm"
    className="h-6 w-6 p-0 ml-auto"
    onClick={() => setIsOpen(false)}
    title="Close"
  >
    <X className="h-3 w-3" />
  </RefinedPopover.Button>
</RefinedPopover.Header>
```

### RefinedPopover.Body

The main content area with consistent spacing.

**Props:**
- `children`: ReactNode - Body content
- `className?`: string - Additional CSS classes

### RefinedPopover.Actions

The action buttons area with proper alignment and spacing.

**Props:**
- `children`: ReactNode - Action buttons (use RefinedPopover.Button for consistency)
- `className?`: string - Additional CSS classes

### RefinedPopover.Button

Consistent button component for popover actions.

**Props:**
- `variant?`: "default" | "outline" | "ghost" - Button style variant (default: "default")
- `size?`: "sm" | "md" - Button size (default: "md")
- `disabled?`: boolean - Whether the button is disabled
- `onClick?`: () => void - Click handler
- `type?`: "button" | "submit" | "reset" - Button type
- `className?`: string - Additional CSS classes
- All standard HTML button attributes

**Recommended Usage:**
```tsx
<RefinedPopover.Actions>
  <RefinedPopover.Button variant="outline" onClick={handleCancel}>
    Cancel
  </RefinedPopover.Button>
  <RefinedPopover.Button variant="default" onClick={handleSave}>
    Save
  </RefinedPopover.Button>
</RefinedPopover.Actions>
```

## Styling

### Default Classes

The component uses a consistent set of Tailwind CSS classes:

- **Container**: `p-4 border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-popover text-popover-foreground rounded-xl`
- **Header**: `flex items-center gap-2.5 mb-5`
- **Body**: `space-y-4`
- **Actions**: `flex justify-end gap-2.5 pt-3 mt-2`
- **Button**: 
  - Base: `h-8 px-4 rounded-lg text-sm transition-all duration-200 font-medium flex items-center justify-center`
  - Default variant: `bg-primary text-primary-foreground hover:bg-primary/90`
  - Outline variant: `text-muted-foreground hover:text-foreground hover:bg-accent/30`

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
