# AurumX Platform - Usage Guide

## Quick Start

### 1. Start the Application
```bash
bun run dev
```
Visit: http://localhost:3000

### 2. Test User Flows

#### Flow 1: Login as Existing User
1. Go to http://localhost:3000
2. Click "Login"
3. Use demo credentials:
   - Email: `root@example.com`
   - Password: `anything` (any text works)
4. You'll be redirected to the Dashboard

#### Flow 2: Register New User
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter a valid referral code: `ROOT1234` or `USERB567`
4. Fill in the form:
   - Name: Your Name
   - Email: newemail@example.com
   - Phone: +91 9876543210
   - Date of Birth: Any date
   - Password: anything
5. Submit
6. You'll be redirected to the Queue page (waiting for approval)

#### Flow 3: Create Investment
1. Login as `root@example.com`
2. On Dashboard, click "New Investment"
3. Enter amount (e.g., 10000)
4. Select risk profile (High Risk will be available)
5. Choose lock-in period (e.g., 2 months)
6. Review the calculation
7. Submit investment request

#### Flow 4: View Network Hierarchy
1. Login as `root@example.com`
2. Scroll to "My Network Hierarchy" section
3. See the tree structure:
   ```
   Root User (You)
   ├── User B
   │   ├── User C
   │   └── User D
   └── User E
   ```
4. Click expand/collapse icons to navigate

## Features Demonstration

### Investment Risk Profiles

#### Test Low Risk (5%)
- Amount: ₹500 - ₹4,999
- Only Low Risk option available
- Example: ₹1,000 with 1 month = ₹50 base + ₹10 bonus = ₹60 return

#### Test Moderate Risk (20%)
- Amount: ₹5,000 - ₹9,999
- Low and Moderate Risk available
- Example: ₹7,000 with 2 months = ₹1,400 base + ₹140 bonus = ₹1,540 return

#### Test High Risk (100%)
- Amount: ₹10,000+
- All risk profiles available
- Example: ₹10,000 with 3 months = ₹10,000 base + ₹300 bonus = ₹10,300 return

### Lock-in Periods
- 1 month: +1% bonus
- 2 months: +2% bonus
- 3 months: +3% bonus
- 6 months: +6% bonus
- 12 months: +12% bonus

### Network Hierarchy Rules

#### Downward Visibility (What You CAN See)
Login as `root@example.com`:
- ✅ Can see User B (direct referral)
- ✅ Can see User C (indirect, through B)
- ✅ Can see User D (indirect, through B)
- ✅ Can see User E (direct referral)

Login as `userb@example.com`:
- ✅ Can see User C (direct referral)
- ✅ Can see User D (direct referral)
- ❌ Cannot see Root User (upline)

#### Upward Visibility (What You CANNOT See)
- Users cannot see who referred them
- Users cannot see the upline hierarchy
- Complete privacy maintained

## Testing Scenarios

### Scenario 1: New User Registration Flow
```
1. Visit landing page
2. Click "Sign Up"
3. Enter referral code: ROOT1234
4. Complete form
5. Submit → Redirected to Queue
6. See "Pending Approval" status
7. Note: In real app, referrer would approve
```

### Scenario 2: Investment Creation
```
1. Login as root@example.com
2. Dashboard → Click "New Investment"
3. Enter ₹15,000
4. All three risk profiles available
5. Select "High Risk" (100%)
6. Choose "6 months" lock-in (+6%)
7. See calculation:
   - Base: ₹15,000
   - Lock-in: ₹900
   - Total Return: ₹15,900
   - Final: ₹30,900
8. Submit
```

### Scenario 3: Referral Code Sharing
```
1. Login to dashboard
2. Find "Your Referral Code" section
3. Click "Copy" button
4. Code copied to clipboard
5. Share with new users
```

### Scenario 4: View Network Statistics
```
Dashboard shows:
- Total Invested: Sum of all investments
- Total Returns: Expected returns
- Direct Referrals: Count of immediate referrals
- Total Network: Count of entire downline
```

## Mock Data

### Pre-loaded Users
| ID | Name | Email | Referral Code | Referrer |
|----|------|-------|---------------|----------|
| user-1 | Root User | root@example.com | ROOT1234 | None |
| user-2 | User B | userb@example.com | USERB567 | user-1 |
| user-3 | User C | userc@example.com | USERC890 | user-2 |
| user-4 | User D | userd@example.com | USERD123 | user-2 |
| user-5 | User E | usere@example.com | USERE456 | user-1 |

### Pre-loaded Investments
- User B: ₹10,000 (High Risk, 2 months) - Active
- User C: ₹5,000 (Moderate Risk, 1 month) - Active

## Common Actions

### Copy Referral Code
```javascript
// Automatically copies to clipboard
// Shows "Copied!" confirmation
```

### Logout
```
Click "Logout" button in header
Redirects to landing page
```

### Navigate Between Pages
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/queue` - Pending approval page
- `/dashboard` - Main dashboard

## Data Storage

All data is stored in browser's LocalStorage:
- `currentUser` - Currently logged in user
- `users` - All registered users
- `investments` - All investments

### Clear Data
```javascript
// Open browser console
localStorage.clear();
// Refresh page
```

## Troubleshooting

### Issue: Can't login
**Solution:** Use any password, authentication is dummy

### Issue: Referral code not working
**Solution:** Use one of these valid codes:
- ROOT1234
- USERB567
- USERC890
- USERD123
- USERE456

### Issue: Not seeing dashboard
**Solution:** 
- Check if user is approved (isApproved: true)
- New signups go to Queue page first
- Login with existing demo accounts

### Issue: Investment not showing
**Solution:**
- Check localStorage for 'investments' key
- Refresh the page
- Create new investment

### Issue: Network hierarchy empty
**Solution:**
- Login as root@example.com (has referrals)
- Other users may not have downline yet

## Development Tips

### Add New User Manually
```javascript
// In browser console
const users = JSON.parse(localStorage.getItem('users'));
users.push({
  id: 'user-new',
  name: 'New User',
  email: 'new@example.com',
  phone: '+91 9999999999',
  dateOfBirth: '1990-01-01',
  referralCode: 'NEWUSER123',
  referrerId: 'user-1',
  isApproved: true,
  createdAt: new Date().toISOString()
});
localStorage.setItem('users', JSON.stringify(users));
```

### Approve Pending User
```javascript
// In browser console
const users = JSON.parse(localStorage.getItem('users'));
const user = users.find(u => u.email === 'pending@example.com');
user.isApproved = true;
localStorage.setItem('users', JSON.stringify(users));
```

### View All Data
```javascript
// In browser console
console.log('Users:', JSON.parse(localStorage.getItem('users')));
console.log('Investments:', JSON.parse(localStorage.getItem('investments')));
console.log('Current User:', JSON.parse(localStorage.getItem('currentUser')));
```

## Important Notes

1. **This is a DUMMY application** - No real money involved
2. **No backend** - All data is client-side only
3. **No real authentication** - Any password works
4. **Data persists** - Uses browser LocalStorage
5. **Clear data** - Use `localStorage.clear()` to reset

## Support

For issues or questions about this prototype, refer to:
- README.md - Full documentation
- MLM-VibeInn_Techverse.pdf - Original requirements
- Source code comments

---

**Happy Testing! 🚀**
