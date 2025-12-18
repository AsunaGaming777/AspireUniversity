# 🎛️ Student Ops Console User Guide

## Overview
The Student Ops Console is a comprehensive administrative dashboard for monitoring, managing, and optimizing the Azerra AI learning platform.

## Access & Permissions

### Required Roles
- **Admin**: Full access to all features
- **Mentor**: Limited access to student management and grading
- **Moderator**: Access to moderation and reporting features

### Login
1. Navigate to `/admin/ops-console`
2. Use your admin credentials
3. Complete 2FA if enabled

## Dashboard Overview

### Key Performance Indicators (KPIs)
- **Daily Active Users**: Real-time user engagement
- **Monthly Active Users**: Monthly user retention
- **Course Completion Rate**: Learning effectiveness
- **Revenue Metrics**: Financial performance
- **System Health**: Infrastructure status

### Cohort Health Cards
- **Student Count**: Active students per cohort
- **Attendance Rate**: Live session participation
- **Average Score**: Academic performance
- **Upcoming Sessions**: Scheduled live events

## Student Management

### Student List
- **Search**: Find students by name, email, or ID
- **Filter**: By role, cohort, status, Discord connection
- **Sort**: By progress, streak, last activity
- **Bulk Actions**: Email, assign remediation, export

### Student Details
- **Profile**: Personal information and preferences
- **Progress**: Course completion and learning path
- **Activity Timeline**: Enrollments, lessons, submissions
- **Certificates**: Earned credentials and achievements
- **Payments**: Transaction history and refunds
- **Affiliate Ties**: Referral relationships

### Student Actions
- **Reset Password**: Generate new temporary password
- **Resend Welcome**: Send onboarding email
- **Toggle Cohort**: Move between cohorts
- **Add Mentor**: Assign personal mentor
- **Revoke Access**: Suspend account access
- **GDPR Export**: Download user data
- **GDPR Delete**: Permanently delete account

## Assignment Management

### Assignment Queue
- **Waiting for Review**: New submissions requiring grading
- **In Revision**: Submissions returned for improvement
- **Graded**: Completed assignments with scores

### Grading Interface
- **Inline Grading**: Direct feedback and scoring
- **Rubric System**: Standardized evaluation criteria
- **Comments**: Detailed feedback for students
- **File Attachments**: Example submissions and resources
- **Pass/Fail**: Binary grading option
- **Score Assignment**: Numerical grading

### SLA Tracking
- **Median Time to Grade**: Performance metrics
- **Alert Thresholds**: Automatic notifications for delays
- **Queue Depth**: Current backlog status
- **Grader Performance**: Individual mentor statistics

## Quiz & Exam Analytics

### Item Analysis
- **Question Difficulty**: Success rate per question
- **Discrimination Index**: Question effectiveness
- **Common Wrong Answers**: Frequent misconceptions
- **Time Analysis**: Completion time patterns

### Integrity Monitoring
- **Time Anomalies**: Unusually fast or slow completions
- **Retake Patterns**: Multiple attempt analysis
- **IP/Device Tracking**: Geographic and device patterns
- **Plagiarism Detection**: Similarity scoring

## Cohort Management

### Live Sessions
- **Calendar View**: Upcoming and past sessions
- **Attendance Tracking**: Participation monitoring
- **Zoom/Jitsi Integration**: Meeting management
- **Recording Management**: Session recordings

### Cohort Operations
- **Create Cohorts**: New cohort setup
- **Clone Cohorts**: Duplicate existing cohorts
- **Set Dates**: Start and end date configuration
- **Assign Mentors**: Mentor allocation
- **Discord Integration**: Auto-create channels and roles

### Announcements
- **Send Announcements**: Cohort-wide communications
- **Discord Integration**: Post to Discord channels
- **Email Integration**: Send email notifications
- **Scheduling**: Delayed and recurring announcements

## Revenue & Affiliate Management

### Revenue Analytics
- **Monthly Recurring Revenue**: MRR tracking
- **Churn Analysis**: Customer retention metrics
- **Conversion Rates**: Enrollment effectiveness
- **Refund Tracking**: Return and chargeback analysis

### Affiliate Management
- **Conversion Tracking**: Referral success rates
- **Commission Calculations**: Earnings computations
- **Payout Generation**: Payment processing
- **Top Affiliates**: Performance rankings
- **Coupon Performance**: Discount code effectiveness

### Payout Operations
- **Generate Payout CSV**: Export payment data
- **Stripe Connect Integration**: Direct payments
- **Discord Notifications**: Admin channel updates
- **Audit Trail**: Complete payment history

## Webhook & Integration Monitoring

### Webhook Timeline
- **Stripe Events**: Payment processing webhooks
- **Discord Events**: Bot interaction webhooks
- **Email Events**: SendGrid delivery webhooks
- **Video Events**: CDN and streaming webhooks

### Webhook Management
- **Status Monitoring**: Success and failure rates
- **Retry Logic**: Automatic retry mechanisms
- **Dead Letter Queue**: Failed webhook handling
- **Replay Function**: Manual webhook retry
- **Payload Viewer**: Webhook content inspection

### Integration Health
- **External Service Status**: Third-party API health
- **Rate Limit Monitoring**: API usage tracking
- **Error Rate Analysis**: Integration failure patterns
- **Performance Metrics**: Response time tracking

## Moderation & Reporting

### Report Management
- **View Reports**: User-submitted reports
- **Investigate Issues**: Detailed case analysis
- **Apply Actions**: Moderation decisions
- **Audit Logging**: Complete action history

### Moderation Actions
- **Warn Users**: Formal warnings
- **Mute Users**: Temporary communication restrictions
- **Kick Users**: Remove from Discord server
- **Suspend Access**: Temporary platform restrictions
- **Ban Users**: Permanent platform exclusion

### Audit Trail
- **Action History**: Complete moderation log
- **User Tracking**: Individual user actions
- **IP/Device Logging**: Security monitoring
- **Export Capabilities**: Data export for compliance

## System Monitoring

### Health Checks
- **Database Status**: Connection and performance
- **Redis Status**: Cache and session storage
- **External APIs**: Third-party service health
- **Discord Bot**: Bot connectivity and permissions

### Performance Metrics
- **Error Rates**: Application error tracking
- **Response Times**: API performance monitoring
- **Queue Depths**: Background job processing
- **SLO Compliance**: Service level objective tracking

### Alerting
- **Real-time Alerts**: Immediate notifications
- **Threshold Monitoring**: Automated alerting
- **Escalation Policies**: Alert routing and escalation
- **Notification Channels**: Slack, email, SMS

## Data Export & Reporting

### Export Options
- **CSV Export**: Tabular data export
- **JSON Export**: Structured data export
- **PDF Reports**: Formatted reports
- **Excel Files**: Spreadsheet-compatible exports

### Report Types
- **Student Reports**: Individual student data
- **Cohort Reports**: Group performance data
- **Revenue Reports**: Financial analytics
- **System Reports**: Infrastructure metrics

### Data Privacy
- **GDPR Compliance**: Data protection compliance
- **Consent Tracking**: User consent management
- **Data Retention**: Automatic data deletion
- **Anonymization**: Privacy-preserving exports

## Best Practices

### Daily Operations
1. **Check System Health**: Review dashboard metrics
2. **Monitor Alerts**: Address any critical issues
3. **Review Assignments**: Process grading queue
4. **Update Cohorts**: Manage live sessions
5. **Check Revenue**: Monitor financial metrics

### Weekly Operations
1. **Student Review**: Analyze student progress
2. **Cohort Health**: Assess cohort performance
3. **Revenue Analysis**: Review financial metrics
4. **System Maintenance**: Update and optimize
5. **Report Generation**: Create weekly reports

### Monthly Operations
1. **Performance Review**: Analyze platform metrics
2. **Cohort Planning**: Plan upcoming cohorts
3. **Revenue Planning**: Financial forecasting
4. **System Optimization**: Performance improvements
5. **Compliance Review**: Audit and compliance checks

## Troubleshooting

### Common Issues
1. **Dashboard Not Loading**: Check browser cache and refresh
2. **Data Not Updating**: Verify database connectivity
3. **Export Failures**: Check file permissions and storage
4. **Permission Errors**: Verify user roles and access
5. **Performance Issues**: Check system resources

### Support Contacts
- **Technical Support**: support@azerra.ai
- **System Administrator**: admin@azerra.ai
- **Emergency Contact**: +1-555-EMERGENCY

### Documentation
- **API Documentation**: /docs/api/
- **User Manuals**: /docs/user-guides/
- **Video Tutorials**: /docs/videos/
- **FAQ**: /docs/faq/

## Security Considerations

### Access Control
- **Role-Based Permissions**: Granular access control
- **Session Management**: Secure session handling
- **Audit Logging**: Complete action tracking
- **Data Encryption**: Secure data transmission

### Data Protection
- **Privacy Controls**: User data protection
- **Consent Management**: User consent tracking
- **Data Retention**: Automatic data deletion
- **Compliance**: Regulatory compliance

### Security Monitoring
- **Access Logging**: User access tracking
- **Anomaly Detection**: Unusual activity monitoring
- **Security Alerts**: Security event notifications
- **Incident Response**: Security incident handling

## Appendix

### Keyboard Shortcuts
- **Ctrl + K**: Quick search
- **Ctrl + R**: Refresh data
- **Ctrl + E**: Export data
- **Ctrl + F**: Find in page
- **Esc**: Close modals

### Browser Requirements
- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+

### Mobile Access
- **Responsive Design**: Mobile-optimized interface
- **Touch Support**: Touch-friendly controls
- **Offline Capability**: Limited offline functionality
- **Push Notifications**: Real-time alerts


