# Profile Settings Test Automation

This document provides comprehensive information about the Profile Settings test automation implementation for Hilal Software's Chatbot Widget.

## 📁 File Structure

```
├── pages/
│   ├── ProfileSettingsPage.js      # Page Object Model for Profile Settings
│   └── TestHelpers.js              # Common utility functions and helpers
├── tests/
│   └── TC_04_profileSettings.spec.js # Comprehensive test suite
├── data/
│   └── test-data.json              # Test data and configuration
└── PROFILE_SETTINGS_TESTING.md    # This documentation file
```

## 🎯 Test Coverage

### 1. Page Navigation and Loading (TC_04_001 - TC_04_003)
- ✅ Profile Settings page loads successfully
- ✅ All required sections are displayed
- ✅ Back navigation functionality works

### 2. Display Image Management (TC_04_004 - TC_04_012)
- ✅ Hover effects show edit/upload options
- ✅ Edit image modal opens with all controls
- ✅ Zoom controls work correctly (0% - 200%)
- ✅ Rotation controls work correctly (0° - 360°)
- ✅ Flip transformations (horizontal/vertical)
- ✅ Filter adjustments (brightness, contrast, saturation, etc.)
- ✅ Save and cancel image editing functionality
- ✅ Image file upload validation

### 3. Display Name Management (TC_04_013 - TC_04_016)
- ✅ Current display name is shown correctly
- ✅ Valid display name updates (multiple test cases)
- ✅ Invalid display name validation and rejection
- ✅ Cancel editing functionality

### 4. Account Details (TC_04_017 - TC_04_021)
- ✅ Email address display validation
- ✅ Current timezone display
- ✅ Timezone dropdown functionality
- ✅ Timezone search functionality
- ✅ Timezone selection for multiple zones

### 5. Form Validation and Error Handling (TC_04_022 - TC_04_024)
- ✅ Network error handling
- ✅ Loading states during operations
- ✅ Client-side form validation

### 6. Accessibility and UI/UX (TC_04_025 - TC_04_028)
- ✅ Keyboard navigation support
- ✅ ARIA labels and accessibility attributes
- ✅ Responsive design testing (mobile, tablet, desktop)
- ✅ Long content handling

### 7. Integration Tests (TC_04_029 - TC_04_030)
- ✅ Data persistence across page refresh
- ✅ Session maintenance during profile updates

### 8. Performance Tests (TC_04_031 - TC_04_032)
- ✅ Page load time validation (< 5 seconds)
- ✅ Multiple rapid updates handling

## 🔧 Page Object Model Features

### ProfileSettingsPage.js
The page object includes comprehensive element selectors and methods for:

#### Navigation Methods
- `navigateToProfileSettings()` - Navigate to profile settings page
- `waitForPageLoad()` - Wait for complete page loading
- `isPageLoaded()` - Check if page loaded correctly

#### Display Image Methods
- `hoverOverDisplayImage()` - Trigger hover effects
- `clickEditImage()` - Open edit image modal
- `adjustZoom(percentage)` - Adjust image zoom
- `adjustRotation(degrees)` - Rotate image
- `flipImageHorizontally()` - Apply horizontal flip
- `adjustBrightness(value)` - Adjust brightness filter
- `saveImageChanges()` - Save image modifications
- `cancelImageEditing()` - Cancel without saving

#### Display Name Methods
- `getCurrentDisplayName()` - Get current display name
- `editDisplayName(newName)` - Update display name
- `saveDisplayName()` - Save display name changes
- `cancelDisplayNameEdit()` - Cancel display name editing

#### Account Details Methods
- `getDisplayedEmail()` - Get displayed email address
- `getCurrentTimezone()` - Get current timezone setting
- `searchTimezone(searchTerm)` - Search for specific timezone
- `selectTimezone(timezoneText)` - Select timezone from dropdown
- `getTimezoneOptions()` - Get all available timezone options

#### Validation Methods
- `isSuccessMessageVisible()` - Check for success notifications
- `isErrorMessageVisible()` - Check for error messages
- `isValidDisplayName(name)` - Validate display name format
- `isValidEmail(email)` - Validate email format

## 🛠️ Test Helper Utilities

### TestHelpers.js
Common utility functions for:

#### Authentication
- `loginUser(page, email, password)` - Generic login method
- `isUserLoggedIn(page)` - Check login status
- `logoutUser(page)` - Logout functionality

#### Data Management
- `loadTestData(fileName)` - Load test data from JSON
- `generateRandomData()` - Generate random test data
- `generateRandomDisplayName(prefix)` - Generate unique display names

#### File and Image Handling
- `createTestImageFile(width, height, format)` - Create test images
- `fileExists(filePath)` - Check file existence
- `ensureDirectoryExists(dirPath)` - Create directories

#### Screenshot and Debugging
- `takeScreenshot(page, name)` - Capture screenshots
- `takeFailureScreenshot(page, testTitle)` - Screenshot on failure
- `capturePageHTML(page, name)` - Save HTML for debugging

#### Validation
- `isValidEmail(email)` - Email format validation
- `isValidDisplayName(name)` - Display name validation
- `isValidTimezone(timezone)` - Timezone format validation
- `isValidImageFile(fileName, fileSize)` - Image file validation

## 📊 Test Data Configuration

### test-data.json
Centralized test data including:

```json
{
  "profileSettings": {
    "validDisplayNames": [
      "John Doe",
      "Jane Smith", 
      "Test User 123",
      "محمد علي",
      "José García"
    ],
    "invalidDisplayNames": [
      "",
      "   ",
      "VERY_LONG_NAME_OVER_100_CHARACTERS..."
    ],
    "timezones": [
      "UTC+00:00 Enderbury",
      "UTC+14:00 Kiritimati",
      "UTC-13:00 Auckland"
    ]
  }
}
```

## 🚀 Running the Tests

### Prerequisites
1. Node.js and npm installed
2. Playwright browsers installed (`npx playwright install`)
3. Environment variables configured in `.env.test`

### Environment Configuration
```bash
# .env.test
BASE_URL="https://dev.auth.hilalsoftware.tools/hilal-chatbot/login"
USEREMAIL="pravallika2330@gmail.com"
PASSWORD="HilalPassword@123"
INVALIDUSEREMAIL="pravallika2330$gmail.com"
INVALIDPASSWORD="--///@@23"
```

### Test Execution Commands

```bash
# Run all profile settings tests
npx playwright test tests/TC_04_profileSettings.spec.js

# Run specific test category
npx playwright test tests/TC_04_profileSettings.spec.js --grep "Display Image Management"

# Run tests in headed mode (visible browser)
npx playwright test tests/TC_04_profileSettings.spec.js --headed

# Run tests with specific browser
npx playwright test tests/TC_04_profileSettings.spec.js --project=Chrome

# Run tests in debug mode
npx playwright test tests/TC_04_profileSettings.spec.js --debug

# Generate Allure report
npm run allure:generate
npm run allure:report
```

## 🎨 Key Features

### 1. **Generic and Reusable Code**
- Works with any user credentials from environment variables
- Flexible element selectors that adapt to different implementations
- Modular design allows easy extension for new features

### 2. **Comprehensive Test Coverage**
- **32 test cases** covering all functionality
- **Positive and negative test scenarios**
- **Edge cases and error conditions**
- **Accessibility and responsive design testing**

### 3. **Robust Error Handling**
- Network failure simulation
- Graceful degradation testing
- Timeout and retry mechanisms
- Detailed error reporting

### 4. **Multi-Language Support**
- Unicode display names (Arabic, Spanish with accents)
- International timezone testing
- Character encoding validation

### 5. **Performance Testing**
- Page load time validation
- Rapid update handling
- Memory and resource usage monitoring

### 6. **Accessibility Testing**
- Keyboard navigation validation
- ARIA label checking
- Screen reader compatibility
- Color contrast verification

## 📱 Responsive Design Testing

Tests validate functionality across multiple viewport sizes:
- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1920x1080 (Full HD)

## 🔍 Debugging and Troubleshooting

### Screenshot Capture
- Automatic screenshots on test failures
- Manual screenshot capture for verification
- Full-page screenshots with timestamps

### HTML Capture
- Page HTML saved for debugging failed tests
- Network request/response logging
- Console error capture

### Test Data Cleanup
- Automatic restoration of original values after tests
- Isolated test execution to prevent interference
- Proper cleanup in `afterEach` hooks

## 🌟 Best Practices Implemented

### 1. **Page Object Model (POM)**
- Clear separation of test logic and page interactions
- Reusable methods across multiple test files
- Maintainable and scalable architecture

### 2. **Data-Driven Testing**
- External test data configuration
- Parameterized tests for multiple scenarios
- Easy test data maintenance

### 3. **Wait Strategies**
- Explicit waits for element visibility
- Network idle waiting for AJAX requests
- Custom retry mechanisms for flaky elements

### 4. **Test Organization**
- Logical grouping of related test cases
- Descriptive test names and comments
- Clear test documentation

### 5. **Error Recovery**
- Graceful handling of unexpected conditions
- Automatic retry for transient failures
- Detailed error logging and reporting

## 🔄 Continuous Integration

The test suite is designed to work with CI/CD pipelines:
- Environment-specific configuration
- Parallel test execution support
- Detailed reporting and artifacts
- Integration with Allure reporting

## 📈 Metrics and Reporting

### Test Execution Metrics
- Total test cases: **32**
- Average execution time: **~15 minutes**
- Success rate target: **>95%**
- Coverage areas: **8 major categories**

### Allure Reporting Features
- Test execution timeline
- Screenshot attachments
- Step-by-step execution details
- Historical trend analysis
- Failure categorization

## 🤝 Contributing

When adding new test cases:
1. Follow the existing naming convention (`TC_04_XXX`)
2. Add comprehensive comments explaining test purpose
3. Include both positive and negative scenarios
4. Update test data configuration as needed
5. Ensure proper cleanup after test execution

## 📞 Support

For questions or issues with the test automation:
1. Check the test execution logs
2. Review screenshot artifacts
3. Verify environment configuration
4. Contact the QA automation team

---

**Created by**: Muhammad Arsalan for Hilal Softwares  
**Framework**: Playwright with JavaScript  
**Reporting**: Allure Reports  
**Version Control**: GitHub
