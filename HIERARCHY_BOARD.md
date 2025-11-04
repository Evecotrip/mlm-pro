# Network Hierarchy Board Feature

## Overview
The Network Hierarchy Board is a dedicated page that displays your complete referral network in a visual card-based tree structure.

## Access
From the Dashboard, click the **"View Hierarchy Board"** button in the "My Network Hierarchy" section.

**URL:** `/hierarchy`

## Features

### Zoom Controls
Located in the **bottom-left corner** of the page:

#### Zoom Buttons
1. **Zoom In (+)** - Increase zoom level by 10%
   - Icon: Magnifying glass with plus
   - Max zoom: 200%
   - Hover: Blue highlight

2. **Zoom Level Display** - Shows current zoom percentage
   - Format: XX%
   - Range: 50% - 200%

3. **Zoom Out (-)** - Decrease zoom level by 10%
   - Icon: Magnifying glass with minus
   - Min zoom: 50%
   - Hover: Blue highlight

4. **Reset Zoom** - Return to 100% zoom
   - Icon: Rotate counter-clockwise
   - Resets to default view
   - Hover: Green highlight

#### Zoom Behavior
- **Default:** 100% (normal size)
- **Minimum:** 50% (half size)
- **Maximum:** 200% (double size)
- **Increment:** 10% per click
- **Smooth Animation:** 300ms transition
- **Transform Origin:** Top center

#### Keyboard Shortcuts (Future)
- `+` or `=` - Zoom in
- `-` or `_` - Zoom out
- `0` - Reset to 100%

### Visual Card Layout
Each user in your network is displayed as a detailed card showing:

#### Card Information
- **User Avatar** - First letter of name in colored circle
- **Name** - Full name of the user
- **Email** - User's email address
- **Phone Number** - Contact number
- **Total Invested** - Sum of all investments (₹)
- **Total Returns** - Expected returns from active investments (₹)
- **Direct Referrals** - Count of immediate referrals
- **Referral Code** - Unique code for sharing
- **Investment Status** - Badge showing number of investments

### Tree Structure

#### Layout Pattern
```
        User A (Root - YOU)
              |
      ┌───────┴───────┐
      |               |
   User B          User E
      |
  ┌───┴───┐
  |       |
User C  User D
```

#### Visual Elements
- **Connecting Lines** - Blue lines showing parent-child relationships
- **Horizontal Lines** - Connect siblings at the same level
- **Vertical Lines** - Connect parent to children
- **Root Badge** - "YOU" badge on your card
- **Color Coding:**
  - Root user (you): Blue border
  - Other users: Gray border (hover: blue)
  - Root avatar: Blue background
  - Other avatars: Purple background

### Card Details

#### Investment Statistics
1. **Total Invested**
   - Icon: Dollar sign
   - Shows sum of all investment amounts
   - Format: ₹X,XXX

2. **Total Returns**
   - Icon: Trending up (green)
   - Shows expected returns from active/matured investments
   - Format: ₹X,XXX (green text)

3. **Direct Referrals**
   - Icon: Users (purple)
   - Count of immediate referrals
   - Format: Number (purple text)

#### User Information
- **Avatar Circle** - Shows first letter of name
- **Full Name** - Primary identifier
- **Email** - Contact email
- **Phone** - Contact number with phone icon
- **Referral Code** - Unique code in monospace font

#### Status Badge
Located at bottom of card:
- **Green Badge** - "X Investment(s)" if user has investments
- **Gray Badge** - "No Investments" if no investments

### Navigation

#### Header
- **Back to Dashboard** - Arrow button to return
- **Title** - "Network Hierarchy"
- **Current User** - Shows who is viewing
- **Logout** - Red logout button

#### Breadcrumb
Shows: "Viewing as [Your Name]"

## Example Network

### Root User (root@example.com)
```
Root User
├── Total Invested: ₹0
├── Total Returns: ₹0
├── Direct Referrals: 2
└── Network: User B, User E, User C, User D
```

### User B (userb@example.com)
```
User B
├── Total Invested: ₹10,000
├── Total Returns: ₹10,200
├── Direct Referrals: 2
└── Children: User C, User D
```

### User C (userc@example.com)
```
User C
├── Total Invested: ₹5,000
├── Total Returns: ₹1,050
├── Direct Referrals: 0
└── Children: None
```

## Visibility Rules

### What You Can See
✅ **Your own card** - Highlighted with "YOU" badge
✅ **All downline members** - Complete tree below you
✅ **Investment details** - Total invested and returns for each member
✅ **Contact information** - Name, email, phone for all downline
✅ **Referral codes** - Each member's unique code

### What You Cannot See
❌ **Upline members** - Cannot see who referred you
❌ **Upline hierarchy** - No visibility above your level
❌ **Sibling networks** - Cannot see other branches at your level

## Card Interactions

### Hover Effects
- Cards scale slightly on hover
- Border changes from gray to blue
- Shadow becomes more prominent

### Responsive Design
- Cards are fixed width (320px)
- Tree adjusts based on number of children
- Horizontal scrolling if tree is too wide
- Vertical scrolling for deep trees

## Technical Details

### Card Dimensions
- Width: 320px (w-80)
- Padding: 24px (p-6)
- Border: 2px solid
- Border Radius: 12px (rounded-xl)
- Shadow: Large (shadow-lg)

### Spacing
- Vertical line height: 48px (h-12)
- Gap between siblings: 32px (gap-8)
- Card internal spacing: 16px (space-y-4)

### Colors
- Root border: Blue-500 (#3B82F6)
- Default border: Gray-200
- Hover border: Blue-300
- Root avatar: Blue-600
- Other avatars: Purple-500
- Connecting lines: Blue-300

## Use Cases

### 1. Network Overview
View your complete referral structure at a glance
- Use zoom out (50-70%) for large networks
- See entire tree structure

### 2. Performance Tracking
See investment statistics for each member
- Zoom in (120-150%) to read details clearly
- Focus on specific branches

### 3. Contact Information
Access phone and email for your downline
- Zoom in for better readability
- Copy contact details easily

### 4. Growth Monitoring
Track direct referrals and total network size
- Zoom out to see growth patterns
- Compare different branches

### 5. Referral Code Sharing
View and share referral codes of network members
- Zoom in to read codes clearly
- Verify correct codes

### 6. Presentations & Screenshots
Capture network structure for presentations
- Adjust zoom for optimal view
- Reset to 100% for standard view

## Tips

### For Root Users
- You'll see the complete network tree
- All branches visible from top to bottom
- **Tip:** Start at 70-80% zoom to see full structure
- Zoom in to specific branches for details

### For Mid-Level Users
- See only your downline
- Cannot see who referred you
- **Tip:** Use 100% zoom for balanced view
- Zoom in when reviewing individual members

### For Leaf Users (No Referrals)
- Card shows "No Investments" or investment count
- Encourage to share referral code
- **Tip:** 100% zoom is perfect for single card view
- Build your own network

### Zoom Tips
- **Large Networks (10+ members):** Start at 60-70%
- **Medium Networks (5-10 members):** Use 80-100%
- **Small Networks (1-4 members):** Use 100-120%
- **Detail View:** Zoom to 150-200% for reading
- **Reset Often:** Use reset button to return to default

## Navigation Flow

```
Landing Page
    ↓
  Login
    ↓
Dashboard
    ↓
Click "View Hierarchy Board"
    ↓
Hierarchy Board (/hierarchy)
    ↓
View Network Tree
    ↓
Click "Back to Dashboard"
    ↓
Dashboard
```

## Data Displayed

### Real-Time Calculations
All statistics are calculated in real-time from:
- User data (mockData.ts)
- Investment data (localStorage)
- Referral relationships (parent-child links)

### Statistics Formula
```javascript
Total Invested = Sum of all investment amounts
Total Returns = Sum of returns from active/matured investments
Direct Referrals = Count of users with referrerId === currentUser.id
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive layout
- Smooth animations and transitions
- CSS Grid and Flexbox for layout

## Future Enhancements (Not Implemented)
- Export network tree as image
- Filter by investment status
- Search for specific users
- Zoom in/out functionality
- Collapse/expand branches
- Print-friendly view
- Download network report

---

**Access the Hierarchy Board from your Dashboard to explore your network!**
