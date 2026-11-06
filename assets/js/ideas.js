/* Catalogue of strategy ideas — single source of truth for the tree, the review dock and the comments page.
   Numbering follows the Product Manager's brief; `slide` is the slide number in "Website Strategy" deck. */
window.XM_IDEAS = [
  {
    id: '01', slide: 21, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Simplified homepage',
    short: 'Fewer blocks, one clear action',
    path: 'ideas/01-homepage/index.html',
    hypothesis: 'A simpler homepage that loads fast will get more visitors to scroll and sign up. Most of our traffic comes from affiliates and goes on to /register, so every second of waiting loses registrations. Today the homepage takes about 4 seconds to load, because it makes a large number of API calls on load (Promotions in particular). Both direct competitors also fail Core Web Vitals, so a fast page is a real advantage.',
    scope: ['Minimal hero, then one block per offering (platforms, promotions, copy trading and competitions, markets, support)', 'Live movers widget: top gainers and top losers', 'Performance first: LCP from about 4 s to 2.5 s or less (the Core Web Vitals "good" threshold), with fewer API calls on load and Core Web Vitals passing on mobile', 'Affiliate traffic lands on a fast page with one clear path to /register', 'A/B test against the current homepage as control'],
    metric: 'Variant conversion vs control (affiliate traffic included); scroll depth; LCP (baseline about 4 s, target 2.5 s or less) and Core Web Vitals pass on mobile'
  },
  {
    id: '02', slide: 22, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Email sign-up on the homepage',
    short: 'Type your email in the hero, registration is pre-filled',
    path: 'ideas/02-hero-email/index.html',
    hypothesis: 'If the first field of the funnel sits in the hero, pre-sold affiliate visitors start registering before they scroll. Average scroll depth is 29%, so most never reach the form.',
    scope: ['Email field in the hero that opens /register pre-filled', 'Affiliate ID attached on the server', 'The same field feeds abandoned-registration recovery'],
    metric: 'Conversion from the component vs the homepage baseline'
  },
  {
    id: '03', slide: 23, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Easier email verification',
    short: 'Confirm with a code, like login already does',
    path: 'ideas/03-verification/index.html',
    dep: true,
    hypothesis: 'Login already uses a 6-digit code; registration still relies on a single link button. Adding the code to the registration email and making the field autofill-ready lets iPhone users, the majority of our traffic, finish verification from the keyboard without leaving the screen. We believe this lifts completion at the last step of registration.',
    scope: ['Registration email: confirm button stays primary, the 6-digit code sits next to it and in the subject line', 'Frontend: one autofill-ready one-time-code field, so iPhone suggests the code above the keyboard; paste and typing work everywhere', 'Android and desktop: copy or type the code, or tap the button, as today', 'The waiting screen continues on its own when the link is opened on any device', 'Resend with cool-down, change email, attempt limits, short expiry'],
    metric: 'Completion rate and time to complete at the verification step, split by iOS, Android and desktop (before vs after)'
  },
  {
    id: '04', slide: 24, wave: 1, obj: 'all', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Personalised journeys',
    short: 'Each visitor type sees its own homepage, sign-up and login',
    path: 'ideas/04-segmentation/index.html',
    hypothesis: 'If we recognise what a visitor came for and adapt the message and one helper on the form to it, we stop averaging conversion and build meaningful journeys per segment. Fields, legal text and prices never change.',
    scope: ['Phase 1: segment from XMTrading-side signals (landing page, affiliate ID, the xmtrading.com pages browsed, language, country, device, returning client)', 'Six personas (bonus, account comparison, learner, platform, support, returning client); everyone else sees today\'s page', 'Homepage keeps today\'s hero; only two blocks adapt: the hero visual and the link under the button. Registration (headline, helper row such as pre-selected account, platform note, practice account or chat) and the next step read the cookie', 'Phase 2: partner pages pass what the visitor read', 'Returning and logged-in clients get a simpler, secure way back in; 10% control hold-out'],
    metric: 'North star denominator; conversion reported per segment'
  },
  {
    id: '05', slide: 25, wave: 1, obj: 'onboarding', status: 'built', effort: 'Medium', priority: 'Low',
    title: 'Sign-up success page',
    short: 'Verified, then one tap into the app',
    path: 'ideas/05-success-handoff/index.html',
    dep: true,
    flag: 'Low priority until we confirm it is worth building.',
    hypothesis: 'If the page every registered user sees makes the first PWA login one tap, more of them start onboarding. Deposit, learn and getting the app are offered as secondary destinations.',
    scope: ['Primary action: continue to the portal (PWA), signed in', 'Optional destination (deposit, learn, get the app) picks the deep link', 'Deep link with a one-time login token', 'Portal opens signed in; the PWA keeps its own onboarding', 'Opt-in follow bundle: brief, webinar, alerts'],
    metric: 'Register success to first PWA login; time to it'
  },
  {
    id: '06', slide: 26, wave: 1, obj: 'conversion', status: 'light', effort: 'Low', priority: 'Medium',
    title: 'Faster sign-up and login',
    short: 'Pages load in the background before the click',
    path: 'ideas/06-preload/index.html',
    hypothesis: 'If the next page is already loaded when the user taps, more users complete the step. Speed at the two hand-over points is a conversion lever.',
    scope: ['Speculation Rules on landing pages for /register', 'On the success page, for the PWA login URL', 'Back/forward cache fixes'],
    metric: 'Register-page load time; conversion; time to first login'
  },
  {
    id: '07', slide: 27, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Finish-your-sign-up email',
    short: 'Reminder email returns you to where you stopped',
    path: 'ideas/07-recovery/index.html',
    dep: true,
    hypothesis: 'If the PWA remembers what a user typed in registration or verification and an email brings them back to the exact screen with that state, more of those who leave finish both steps.',
    scope: ['Registration (website) and verification (PWA) save every answer as a state while the user types; the password is never stored', 'If the user leaves, the last screen and the state are kept', 'A re-targeting email names that screen and deep-links to it; the link opens the website on the registration screen, or the PWA on the verification screen, with the answers filled in', 'Emails stop once the flow is completed or the state expires'],
    metric: 'Completion of abandoned registrations and verifications after the email; email click-through; time from email to completion'
  },
  {
    id: '18', slide: 'TBD', wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'Low',
    title: 'Password generator',
    short: 'One click creates a valid password',
    path: 'ideas/18-password-helper/index.html',
    dep: true,
    flag: 'Investigate the iOS native password generator first.',
    hypothesis: 'If people who stall on the password rules get an email with a one-click generator that only produces compliant, unique passwords, more of them come back and finish registration.',
    scope: ['Generator widget: compliant by construction, unique each click, copy button, runs in the browser only', 'Embedded in the abandoned-registration email (AMP for Email), hosted page as the fallback', 'Resume link opens the form with the email filled in; the password is never placed in the link'],
    metric: 'Recovery-email click-through; form completion after the email; password-error rate on the form'
  },
  {
    id: '09', slide: 30, wave: 2, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Try the Portal without an account',
    short: 'Guest demo with a virtual balance',
    path: 'ideas/09-try/portal.html',
    hypothesis: 'If the Portal has a page of its own that shows its real screen and opens a guest demo with a virtual balance, people who never register today see the product before the form and start the funnel.',
    scope: ['/portal product page: description, feature list, install-as-app and FAQ', 'Live screen preview; selecting it opens the demo Portal in guest mode with a virtual balance', 'Email asked only to save progress; register CTA inside the Portal', 'Guest session hands over to the real account after registration'],
    metric: 'Portal page to demo start; demo start to register; guest session to live account'
  },
  {
    id: '10', slide: 31, wave: 2, obj: 'onboarding', status: 'built', effort: 'Medium', priority: 'Medium',
    title: 'Getting-started guide',
    short: 'Six steps, a video for each',
    path: 'ideas/10-getting-started/index.html',
    hypothesis: 'If each step from registration to the first trade is shown in a video that links to that PWA screen, more registered users reach the first trade.',
    scope: ['Six steps: register, verify, log in, deposit, choose account, first trade', 'One 60-90 s video per step; experienced? skip link', 'The same path appears gamified inside the PWA'],
    metric: 'Hub to first PWA login; hub to FTD'
  },
  {
    id: '11', slide: 32, wave: 2, obj: 'content', status: 'built', effort: 'High', priority: 'Medium',
    title: 'One page per instrument',
    short: 'For search and ads, with the trade pre-filled',
    path: 'ideas/11-instrument/index.html',
    hypothesis: 'If one page per instrument answers everything a searcher wants before trading it, search and PPC traffic converts above the site average.',
    scope: ['Programmatic pages with spread, swap, hours, margin, chart and commentary', 'Pre-filled trade ticket, then register', 'Gated extras after register and KYC'],
    metric: 'Content-first share; content-first to register'
  },
  {
    id: '08', slide: 29, wave: 2, obj: 'content', status: 'built', effort: 'Medium', priority: 'Medium',
    title: 'Trade ideas page',
    short: 'Top movers next to trade ideas',
    path: 'ideas/08-trade-ideas/index.html',
    hypothesis: 'If one page shows what is moving in the market and pairs it with trade ideas, search visitors stay, open an instrument page and a share register or trade.',
    scope: ['Top gainers and top losers by market and period (today, 1 week, 1 month), live-style prices', 'Trade ideas preview: entry, stop and target prices blurred until registration; the first ideas open, the rest fully locked', 'Every row opens the instrument page (idea 11) with the ticket ready', 'Linked from the Learn & Research menu, the homepage and instrument pages'],
    metric: 'Hub visits from search; click-through to instrument pages; locked idea to register; hub visit to first trade'
  },
  {
    id: '12', slide: 33, wave: 3, obj: 'retention', status: 'built', effort: 'Low', priority: 'High',
    title: 'Welcome-back offer',
    short: 'Time-limited offer with one-tap login',
    path: 'ideas/12-welcome-back/index.html',
    hypothesis: 'If inactive clients get a dated, entry-gated offer with one-tap login, a measurable share returns to deposit and trade.',
    scope: ['/welcome-back for accounts with no trade since a cutoff date', 'Extra deposit bonus or XMP multiplier for 60 days; log in to enter', 'Homepage banner slot; run as a numbered series'],
    metric: 'Dormant reactivation; re-deposit'
  },
  {
    id: '13', slide: 34, wave: 3, obj: 'retention', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Notification sign-up',
    short: 'Pop-up: email for visitors, app alerts for clients',
    path: 'ideas/13-notifications/index.html',
    hypothesis: 'If visitors choose what they hear about, including seasonal campaigns, XM can reach them before they register. Looking the email up first means only non-clients get email, while clients and newly registered users get the same topics in the PWA and the mobile app.',
    scope: ['Redesigned pop-up: market updates, webinars, trading signals, courses and seasonal promotions', 'Triggered after a dwell timeout on content pages, and on the homepage with seasonal promotions leading; the visitor ticks the topics, nothing is pre-ticked', 'Email lookup: non-clients are emailed; clients get the same topics in the PWA and app; on registration the same choices run in the PWA and the app', '/notifications with web push and email; per-item control', 'Same confirmation shown whether or not an account exists (no account enumeration)'],
    metric: 'Pop-up opt-in rate by page type; subscribers who register within 30 days; seasonal campaign click-through from subscribers; opt-out rate per channel'
  },
  {
    id: '14', slide: 35, wave: 3, obj: 'retention', status: 'built', effort: 'Low', priority: 'Medium',
    title: 'Smart login for existing clients',
    short: 'One click to where the client wants to go',
    path: 'ideas/14-login-router/index.html',
    hypothesis: 'If existing clients land one click from the place they want and see offers for a second account, re-entry rises.',
    scope: ['Login menu: trade / members area / MT4-MT5', 'Homepage module: add a KIWAMI or Zero account, move to MT5, start copy trading', 'Each option deep-links into the PWA'],
    metric: 'Existing-account visitors to PWA login'
  },
  {
    id: '15', slide: 36, wave: 3, obj: 'content', status: 'built', effort: 'High', priority: 'Medium',
    title: 'Learn and earn a bonus',
    short: 'Finish lessons, get a x2 deposit bonus and a badge',
    path: 'ideas/15-learn-to-earn/index.html',
    hypothesis: 'If completing a course with a quiz unlocks a bonus after verification and deposit, engaged learners convert to FTD at a higher rate and arrive better informed.',
    scope: ['Tracks: platform tutorials, forex fundamentals, crypto, precious metals, news trading', 'Unlock chain: register, course, verify, deposit (bonus x2)', 'Shareable completion artifact'],
    metric: 'Course completion to FTD'
  },
  {
    id: '16', slide: 37, wave: 3, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'Low',
    title: 'Refer a friend',
    short: 'Get a referral code without an account',
    path: 'ideas/16-refer/index.html',
    hypothesis: 'If a visitor can share a link before registering and earn a small reward when a referral deposits, we gain a low-cost referral channel and the referrer registers to claim it.',
    scope: ['Code widget on the Refer a Friend page for non-registered visitors', 'Email to the referrer when a referral deposits, prompting registration', 'Compliance and AML review first'],
    metric: 'Referral registrations; referrer registrations; FTD of referred users'
  },
  {
    id: '17', slide: 39, wave: 3, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'Low',
    title: 'XMTrading web MCP server',
    short: 'Ask about XMTrading and open an account from your terminal',
    path: 'ideas/17-mcp/index.html',
    hypothesis: 'A hosted MCP server lets people use their own AI assistant to get correct answers about XMTrading and to start an account without opening the website. Answers come from XMTrading\'s own facts, and the password and ID never pass through the assistant.',
    scope: ['Web (hosted) MCP server only, nothing to install', 'Job 1: answer questions about XMTrading from the first source, with the source named, a country check and a risk line', 'Job 2: open an account in the terminal: consent, email code, then a one-time secure link to set the password and finish verification on XMTrading', 'Read-only tools for facts; a few write tools for registration, behind explicit consent'],
    metric: 'Registrations started through MCP and their completion rate; share of answers with a named source; registration-quality guardrail'
  }
];

window.XM_WAVES = {
  1: { label: 'Wave 1', range: 'Months 0-3', theme: 'Measure, fix the key pages' },
  2: { label: 'Wave 2', range: 'Months 3-6', theme: 'Answer, and let people try' },
  3: { label: 'Wave 3', range: 'Months 6-9', theme: 'Return, and reward learning' }
};

window.XM_OBJ = {
  conversion: { label: 'Conversion', color: '#008454' },
  onboarding: { label: 'Onboarding', color: '#2f62f0' },
  retention:  { label: 'Retention',  color: '#c26a00' },
  content:    { label: 'Content',    color: '#8a3fd1' },
  all:        { label: 'All objectives', color: '#1d2024' }
};

/* Customer journeys: the order in which a visitor meets the ideas. Used by the hub (Journeys view) and the dock. */
window.XM_JOURNEYS = [
  { id: 'a', label: 'Journey A', theme: 'From first visit to a registered client', steps: ['04', '01', '02', '03', '05', '06', '07', '18'] },
  { id: 'b', label: 'Journey B', theme: 'See it, try it, learn it, fund it', steps: ['09', '11', '10', '15', '08'] },
  { id: 'c', label: 'Journey C', theme: 'Bring clients back and keep them', steps: ['14', '12', '13', '16', '17'] }
];
