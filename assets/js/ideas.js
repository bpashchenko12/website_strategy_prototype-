/* Catalogue of strategy ideas — single source of truth for the tree, the review dock and the comments page.
   Numbering follows the Product Manager's brief; `slide` is the slide number in "Website Strategy" deck. */
window.XM_IDEAS = [
  {
    id: '01', slide: 21, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Simplified homepage',
    short: 'Kraken-style block homepage',
    path: 'ideas/01-homepage/index.html',
    hypothesis: 'One message, pillars for the main offerings and a fast load raise scroll depth and sign-up conversion. The site works as an affiliate traffic router to /register, so every second before the first screen appears costs registrations. Today LCP is about 4 s, because many API calls on load hold performance back, while both direct competitors fail Core Web Vitals.',
    scope: ['Minimal hero, then one block per offering (platforms, promotions, copy trading and competitions, markets, support)', 'Live movers widget: top gainers and top losers', 'Performance first: LCP from about 4 s to 2.5 s or less (the Core Web Vitals "good" threshold), with fewer API calls on load and Core Web Vitals passing on mobile', 'Affiliate traffic lands on a fast page with one clear path to /register', 'A/B test against the current homepage as control'],
    metric: 'Variant conversion vs control (affiliate traffic included); scroll depth; LCP (baseline about 4 s, target 2.5 s or less) and Core Web Vitals pass on mobile'
  },
  {
    id: '02', slide: 22, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Hero registration prompt with email field',
    short: 'Email field in the hero, pre-fills /register',
    path: 'ideas/02-hero-email/index.html',
    hypothesis: 'If the first field of the funnel sits in the hero, pre-sold affiliate visitors start registering before they scroll. Average scroll depth is 29%, so most never reach the form.',
    scope: ['Email field in the hero that opens /register pre-filled', 'Affiliate ID attached on the server', 'The same field feeds abandoned-registration recovery'],
    metric: 'Conversion from the component vs the homepage baseline'
  },
  {
    id: '03', slide: 23, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Email verification without friction',
    short: 'Registration gets the code login already has',
    path: 'ideas/03-verification/index.html',
    hypothesis: 'Login already uses a 6-digit code; registration still relies on a single link button. Adding the code to the registration email and making the field autofill-ready lets iPhone users, the majority of our traffic, finish verification from the keyboard without leaving the screen. We believe this lifts completion at the last step of registration.',
    scope: ['Registration email: confirm button stays primary, the 6-digit code sits next to it and in the subject line', 'Frontend: one autofill-ready one-time-code field, so iPhone suggests the code above the keyboard; paste and typing work everywhere', 'Android and desktop: copy or type the code, or tap the button, as today', 'The waiting screen continues on its own when the link is opened on any device', 'Resend with cool-down, change email, attempt limits, short expiry'],
    metric: 'Completion rate and time to complete at the verification step, split by iOS, Android and desktop (before vs after)'
  },
  {
    id: '04', slide: 24, wave: 1, obj: 'all', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Segmentation: one cookie, one journey per segment',
    short: 'Persona-driven homepage, registration and login',
    path: 'ideas/04-segmentation/index.html',
    hypothesis: 'If we recognise what a visitor came for and adapt the message and one helper on the form to it, we stop averaging conversion and build meaningful journeys per segment. Fields, legal text and prices never change.',
    scope: ['Phase 1: segment from XMTrading-side signals (landing page, affiliate ID, language, country, device, returning client)', 'Six personas (bonus, account comparison, learner, platform, support, returning client); everyone else sees today\'s page', 'Homepage and registration content customizable per persona: headline, subline, button, visual, helper row (pre-selected account, platform note, practice account, chat) and next step read the cookie', 'Phase 2: partner pages pass what the visitor read', 'Returning and logged-in clients get a simpler, secure way back in; 10% control hold-out'],
    metric: 'North star denominator; conversion reported per segment'
  },
  {
    id: '05', slide: 25, wave: 1, obj: 'onboarding', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Register-success page as one designed asset',
    short: 'Verified, then one tap into the PWA',
    path: 'ideas/05-success-handoff/index.html',
    hypothesis: 'If the page every registered user sees makes the first PWA login one tap, more of them start onboarding. Deposit, learn and getting the app are offered as secondary destinations.',
    scope: ['Primary action: continue to the portal (PWA), signed in', 'Optional destination (deposit, learn, get the app) picks the deep link', 'Deep link with a one-time login token', 'Portal opens signed in; the PWA keeps its own onboarding', 'Opt-in follow bundle: brief, webinar, alerts'],
    metric: 'Register success to first PWA login; time to it'
  },
  {
    id: '06', slide: 26, wave: 1, obj: 'conversion', status: 'light', effort: 'Low', priority: 'Medium',
    title: 'Pre-load the register and PWA login pages',
    short: 'Speculation Rules, bfcache (performance)',
    path: 'ideas/06-preload/index.html',
    hypothesis: 'If the next page is already loaded when the user taps, more users complete the step. Speed at the two hand-over points is a conversion lever.',
    scope: ['Speculation Rules on landing pages for /register', 'On the success page, for the PWA login URL', 'Back/forward cache fixes'],
    metric: 'Register-page load time; conversion; time to first login'
  },
  {
    id: '07', slide: 27, wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'High',
    title: 'Abandoned registration and verification recovery',
    short: 'PWA saves input as a state; email re-opens the exact screen with it',
    path: 'ideas/07-recovery/index.html',
    hypothesis: 'If the PWA remembers what a user typed in registration or verification and an email brings them back to the exact screen with that state, more of those who leave finish both steps.',
    scope: ['Registration and verification inside the PWA save every answer as a state while the user types; the password is never stored', 'If the user leaves, the last screen and the state are kept', 'A re-targeting email names that screen and deep-links to it; the link opens the PWA on the screen with the answers filled in', 'Emails stop once the flow is completed or the state expires'],
    metric: 'Completion of abandoned registrations and verifications after the email; email click-through; time from email to completion'
  },
  {
    id: '18', slide: 'TBD', wave: 1, obj: 'conversion', status: 'built', effort: 'Low', priority: 'Medium',
    title: 'Password generator helper',
    short: 'One-click compliant password, in the recovery email',
    path: 'ideas/18-password-helper/index.html',
    hypothesis: 'If people who stall on the password rules get an email with a one-click generator that only produces compliant, unique passwords, more of them come back and finish registration.',
    scope: ['Generator widget: compliant by construction, unique each click, copy button, runs in the browser only', 'Embedded in the abandoned-registration email (AMP for Email), hosted page as the fallback', 'Resume link opens the form with the email filled in; the password is never placed in the link'],
    metric: 'Recovery-email click-through; form completion after the email; password-error rate on the form'
  },
  {
    id: '09', slide: 30, wave: 2, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Try the XMTrading Portal without an account',
    short: 'Portal page with a live preview that opens a guest demo',
    path: 'ideas/09-try/portal.html',
    hypothesis: 'If the Portal has a page of its own that shows its real screen and opens a guest demo with a virtual balance, people who never register today see the product before the form and start the funnel.',
    scope: ['/portal product page: description, feature list, install-as-app and FAQ', 'Live screen preview; selecting it opens the demo Portal in guest mode with a virtual balance', 'Email asked only to save progress; register CTA inside the Portal', 'Guest session hands over to the real account after registration'],
    metric: 'Portal page to demo start; demo start to register; guest session to live account'
  },
  {
    id: '10', slide: 31, wave: 2, obj: 'onboarding', status: 'built', effort: 'Medium', priority: 'Medium',
    title: 'Getting-started hub (video path)',
    short: 'Six steps, video per step, linked to the PWA',
    path: 'ideas/10-getting-started/index.html',
    hypothesis: 'If each step from registration to the first trade is shown in a video that links to that PWA screen, more registered users reach the first trade.',
    scope: ['Six steps: register, verify, log in, deposit, choose account, first trade', 'One 60-90 s video per step; experienced? skip link', 'The same path appears gamified inside the PWA'],
    metric: 'Hub to first PWA login; hub to FTD'
  },
  {
    id: '11', slide: 32, wave: 2, obj: 'content', status: 'built', effort: 'High', priority: 'Medium',
    title: 'Instrument subpages (SEO / PPC)',
    short: 'One page per instrument, trade pre-filled',
    path: 'ideas/11-instrument/index.html',
    hypothesis: 'If one page per instrument answers everything a searcher wants before trading it, search and PPC traffic converts above the site average.',
    scope: ['Programmatic pages with spread, swap, hours, margin, chart and commentary', 'Pre-filled trade ticket, then register', 'Gated extras after register and KYC'],
    metric: 'Content-first share; content-first to register'
  },
  {
    id: '08', slide: 29, wave: 2, obj: 'content', status: 'built', effort: 'Medium', priority: 'Medium',
    title: 'Trade ideas hub: top movers and trade ideas',
    short: 'Top gainers and losers beside a trade ideas preview',
    path: 'ideas/08-trade-ideas/index.html',
    hypothesis: 'If one page shows what is moving in the market and pairs it with trade ideas, search visitors stay, open an instrument page and a share register or trade.',
    scope: ['Top gainers and top losers by market and period (today, 1 week, 1 month), live-style prices', 'Trade ideas preview: entry, stop and target prices blurred until registration; the first ideas open, the rest fully locked', 'Every row opens the instrument page (idea 11) with the ticket ready', 'Linked from the Learn & Research menu, the homepage and instrument pages'],
    metric: 'Hub visits from search; click-through to instrument pages; locked idea to register; hub visit to first trade'
  },
  {
    id: '12', slide: 33, wave: 3, obj: 'retention', status: 'built', effort: 'Low', priority: 'High',
    title: 'Welcome-back campaign page',
    short: 'Dated, entry-gated offer with one-tap login',
    path: 'ideas/12-welcome-back/index.html',
    hypothesis: 'If inactive clients get a dated, entry-gated offer with one-tap login, a measurable share returns to deposit and trade.',
    scope: ['/welcome-back for accounts with no trade since a cutoff date', 'Extra deposit bonus or XMP multiplier for 60 days; log in to enter', 'Homepage banner slot; run as a numbered series'],
    metric: 'Dormant reactivation; re-deposit'
  },
  {
    id: '13', slide: 34, wave: 3, obj: 'retention', status: 'built', effort: 'Medium', priority: 'High',
    title: 'Dwell pop-up, seasonal promotions and notification centre',
    short: 'Pop-up on content pages and homepage; email non-clients, PWA and app for clients',
    path: 'ideas/13-notifications/index.html',
    hypothesis: 'If visitors choose what they hear about, including seasonal campaigns, XM can reach them before they register. Looking the email up first means only non-clients get email, while clients and newly registered users get the same topics in the PWA and the mobile app.',
    scope: ['Redesigned pop-up: market updates, webinars, trading signals, courses and seasonal promotions', 'Triggered after a dwell timeout on content pages, and on the homepage with seasonal promotions pre-selected', 'Email lookup: non-clients are emailed; clients get the same topics in the PWA and app; on registration all three channels are active', '/notifications with web push, email and LINE; per-item control', 'Same confirmation shown whether or not an account exists (no account enumeration)'],
    metric: 'Pop-up opt-in rate by page type; subscribers who register within 30 days; seasonal campaign click-through from subscribers; opt-out rate per channel'
  },
  {
    id: '14', slide: 35, wave: 3, obj: 'retention', status: 'built', effort: 'Low', priority: 'Medium',
    title: 'Login router and "already a client" module',
    short: 'Recognised clients, one click to where they want',
    path: 'ideas/14-login-router/index.html',
    hypothesis: 'If existing clients land one click from the place they want and see offers for a second account, re-entry rises.',
    scope: ['Login menu: trade / members area / MT4-MT5', 'Homepage module: add a KIWAMI or Zero account, move to MT5, start copy trading', 'Each option deep-links into the PWA'],
    metric: 'Existing-account visitors to PWA login'
  },
  {
    id: '15', slide: 36, wave: 3, obj: 'content', status: 'built', effort: 'High', priority: 'Medium',
    title: 'Learn-to-earn deposit bonus',
    short: 'Gamified learning paths, x2 bonus, shareable badge',
    path: 'ideas/15-learn-to-earn/index.html',
    hypothesis: 'If completing a course with a quiz unlocks a bonus after verification and deposit, engaged learners convert to FTD at a higher rate and arrive better informed.',
    scope: ['Tracks: platform tutorials, forex fundamentals, crypto, precious metals, news trading', 'Unlock chain: register, course, verify, deposit (bonus x2)', 'Shareable completion artifact'],
    metric: 'Course completion to FTD'
  },
  {
    id: '16', slide: 37, wave: 3, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'Low',
    title: 'Refer a friend without registering',
    short: 'Generate a referral code with no account',
    path: 'ideas/16-refer/index.html',
    hypothesis: 'If a visitor can share a link before registering and earn a small reward when a referral deposits, we gain a low-cost referral channel and the referrer registers to claim it.',
    scope: ['Code widget on the Refer a Friend page for non-registered visitors', 'Email to the referrer when a referral deposits, prompting registration', 'Compliance and AML review first'],
    metric: 'Referral registrations; referrer registrations; FTD of referred users'
  },
  {
    id: '17', slide: 39, wave: 4, obj: 'conversion', status: 'built', effort: 'Medium', priority: 'Low',
    title: 'Informational MCP server and assistant',
    short: 'Answers on conditions, support and platforms',
    path: 'ideas/17-assistant/index.html',
    hypothesis: 'If account types, bonus terms by country, payment methods and platform facts are available from one source of truth, assistants quote the right numbers and fewer users arrive with wrong expectations.',
    scope: ['Read-only MCP server exposing public facts', 'Country check first; regulator and risk warning in every answer', 'Same data feeds llms.txt, structured data and an on-site assistant'],
    metric: 'Organic and referral share; registration-quality guardrail'
  }
];

window.XM_WAVES = {
  1: { label: 'Wave 1', range: 'Months 0-3', theme: 'Measure, fix the key pages' },
  2: { label: 'Wave 2', range: 'Months 3-6', theme: 'Answer, and let people try' },
  3: { label: 'Wave 3', range: 'Months 6-9', theme: 'Return, and reward learning' },
  4: { label: 'Later', range: 'Beyond 9 months', theme: 'Assistants and search' }
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
