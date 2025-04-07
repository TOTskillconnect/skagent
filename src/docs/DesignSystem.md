# SkillConnect Design System

This document outlines the standardized design system for the SkillConnect application, with a special focus on card layouts and UI components.

## 🎨 Color Scheme

**Primary Colors:**
- Primary: `#FFB130` (Yellow-Orange) - Used for primary actions, highlights, and key UI elements
- Text (Dark): `#043444` (Deep Blue-Green) - Used for headings and primary text
- Text (Gray): `#666666` - Used for secondary text and supporting information

**Semantic Colors:**
- Stage Tags: `#FFB130` (Yellow-Orange) - For stage-related context (e.g., "Series A Ready")
- Culture Tags: `#1ad3bb` (Teal) - For culture/team context (e.g., "Remote Team Fit")
- Domain Tags: Gray - For domain or industry experience (e.g., "Fintech Experience")
- Skills: Light Gray - For skills (e.g., "React", "TypeScript")
- Verification: Green - For verification badges (e.g., "✅ Identity Verified")

## 📏 Spacing & Layout

**Border Radius:**
- Cards: `rounded-xl` (0.75rem)
- Tags: `rounded-md` (0.375rem) for context tags, `rounded-full` for skill and verification tags

**Shadows:**
- Default: `shadow-sm` - Subtle shadow for most cards
- Elevated: `shadow-md` - More pronounced shadow for highlighted elements
- Hover: Enhanced shadow and slight elevation (translateY) when hovering over interactive elements

**Padding:**
- Cards: `p-6` (1.5rem) internal padding
- Tags: `px-2 py-1` (horizontal: 0.5rem, vertical: 0.25rem)

## 📦 Card Components

### Standard Card

```jsx
<Card 
  title="Optional Title"
  subtitle="Optional subtitle"
  icon={<SomeIcon />} // Optional icon
  actions={<Button>Action</Button>} // Optional actions
  className="additional-classes" // Optional additional classes
  noPadding={false} // Whether to remove padding
  elevated={false} // Whether to use elevated shadow
  bordered={true} // Whether to show border
  interactive={true} // Whether to add hover effects
>
  Card content goes here
</Card>
```

### Context Tags

Color-coded tags for displaying different types of information:

```jsx
<ContextTag text="Series A Ready" type="stage" />
<ContextTag text="Remote Team Fit" type="culture" />
<ContextTag text="Fintech Experience" type="domain" />
<ContextTag text="React" type="skill" />
<ContextTag text="Identity Verified" type="verification" />
```

## 🧩 Card Patterns

### Candidate Card

The candidate card represents our standard card layout approach, emphasizing context and "why" over just "what". Key features:

1. **Top Section:** Name/role/title with match score
2. **Summary:** Context-rich description of candidate's fit
3. **Context Tags:** Color-coded tags showing alignment (stage, culture, domain)
4. **Skills:** Highlighted but secondary to context
5. **Verification:** Trust signals when available
6. **Action Area:** Clear call-to-actions with consistent styling

Example implementation:

```jsx
<Card interactive bordered className="space-y-4">
  {/* Top Section */}
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-lg font-semibold text-[#043444]">Candidate Name</h3>
      <p className="text-sm text-gray-500">Role Title</p>
    </div>
    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
      Match Score: 87%
    </span>
  </div>

  {/* Summary */}
  <p className="text-sm text-gray-700 line-clamp-2">
    Context-rich summary explaining why the candidate is a good fit.
  </p>

  {/* Context Fit Tags */}
  <div className="flex flex-wrap gap-2">
    <ContextTag text="Series A Ready" type="stage" />
    <ContextTag text="Remote Team Fit" type="culture" />
    <ContextTag text="Fintech Experience" type="domain" />
  </div>

  {/* Skills Section */}
  <div className="pt-2">
    <p className="text-xs text-gray-500 mb-1 font-medium">Vetted Skills:</p>
    <div className="flex flex-wrap gap-2">
      <ContextTag text="React" type="skill" />
      <ContextTag text="TypeScript" type="skill" />
    </div>
  </div>

  {/* CTAs */}
  <div className="flex justify-between items-center pt-4 border-t mt-4">
    <a href="#" className="text-sm text-[#043444] hover:underline">View Profile</a>
    <button className="bg-[#FFB130] text-black text-sm font-semibold px-4 py-1.5 rounded-md">
      Send Assessment
    </button>
  </div>
</Card>
```

## 🔍 UX Principles

1. **Context Over Content:** Emphasize why something matters, not just what it is
2. **Visual Hierarchy:** Use spacing, typography, and color to guide attention
3. **Consistent Patterns:** Use the same UI patterns for similar content types
4. **Interactive Feedback:** Provide clear visual feedback for interactive elements
5. **Mobile-First:** Ensure all components work well on all screen sizes

## 📱 Responsive Behavior

Cards should be wrapped in appropriate grid layouts:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <YourCardComponent key={item.id} item={item} />
  ))}
</div>
```

## 🤖 Generating Cards Automatically

When generating new cards programmatically:

1. Use the `Card` component as the base container
2. Add the `interactive` prop for hover effects
3. Use `ContextTag` components for all tag/pill elements
4. Follow the standard layout pattern (header, summary, tags, details, footer)
5. Maintain the standardized spacing with `space-y-4` and appropriate margins
6. Use the semantic color system consistently

## 🧪 Accessibility Considerations

1. Ensure sufficient color contrast, especially for text on colored backgrounds
2. Provide clear focus styles for interactive elements
3. Use semantic HTML where appropriate
4. Ensure text is readable at all sizes
5. Test with keyboard navigation

---

*This design system should be followed for all new UI components and when updating existing ones to ensure a consistent, polished user experience throughout the application.* 