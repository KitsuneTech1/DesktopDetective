// Case 1: The CEO's Last Meeting
const CASE_DATA = {
    id: "case1",
    title: "The CEO's Last Meeting",
    caseNumber: "2024-001",
    difficulty: 2,

    briefing: `
        <p><strong>VICTIM:</strong> Marcus Chen, 42, CEO of NovaTech Solutions</p>
        <p><strong>CAUSE OF DEATH:</strong> Poisoning (suspected)</p>
        <p><strong>LOCATION:</strong> NovaTech headquarters, private office</p>
        <p><strong>TIME OF DEATH:</strong> March 15, 2024, approximately 7:30 PM</p>
        <br>
        <p>Marcus Chen was found dead at his desk by cleaning staff at 9:15 PM. An autopsy revealed traces of ethylene glycol (antifreeze) in his system, mixed into his evening coffee.</p>
        <br>
        <p><strong>YOUR TASK:</strong> You have been given remote access to the primary suspect's laptop. Examine all files, emails, messages, and browsing history to determine who murdered Marcus Chen and gather evidence to support your accusation.</p>
        <br>
        <p><strong>EVIDENCE REQUIRED:</strong> Find at least 3 pieces of evidence linking the killer to the crime before making your accusation.</p>
    `,

    suspects: [
        {
            id: "diana",
            name: "Diana Chen",
            relation: "Wife of the victim",
            description: "Married to Marcus for 12 years. Recently discovered his affair."
        },
        {
            id: "tyler",
            name: "Tyler Ross",
            relation: "Business Partner & CFO",
            description: "Co-founded NovaTech with Marcus. Handles all finances."
        },
        {
            id: "alex",
            name: "Alex Kim",
            relation: "Former Employee",
            description: "Senior developer fired by Marcus two weeks before the murder."
        },
        {
            id: "sam",
            name: "Sam Chen",
            relation: "Victim's Brother",
            description: "Estranged from Marcus. Was recently cut from the family trust."
        }
    ],

    killer: "tyler",

    requiredEvidence: 3,

    keyEvidence: [
        "tyler_insurance_email",
        "tyler_browser_poison",
        "tyler_chat_debt",
        "tyler_calendar_meeting"
    ],

    // File system structure
    fileSystem: {
        "Documents": {
            type: "folder",
            children: {
                "NovaTech": {
                    type: "folder",
                    children: {
                        "quarterly_report.txt": {
                            type: "file",
                            icon: "📄",
                            size: "2.4 KB",
                            date: "Mar 14, 2024",
                            content: `NOVATECH SOLUTIONS - Q1 2024 FINANCIAL REPORT
=========================================

EXECUTIVE SUMMARY:
Despite strong product performance, operational costs have exceeded projections by 34%. 

KEY CONCERNS:
- Unexplained $2.3M in "consulting fees" (see attached breakdown - MISSING)
- CFO Tyler Ross has requested sole signatory authority on accounts
- Audit scheduled for April 15, 2024

RECOMMENDATION:
Board should review all financial transactions before audit.

- Marcus Chen, CEO`
                        },
                        "insurance_policy.txt": {
                            type: "file",
                            icon: "📄",
                            size: "4.1 KB",
                            date: "Jan 15, 2024",
                            content: `NOVATECH EXECUTIVE LIFE INSURANCE POLICY
========================================

Policy #: NVT-2024-0892
Effective: January 15, 2024

INSURED: Marcus Chen (CEO)
COVERAGE: $5,000,000

BENEFICIARY DESIGNATION:
Primary: Tyler Ross (Business Partner) - 60%
Secondary: Diana Chen (Spouse) - 40%

Note: Policy updated January 2024.
Previous beneficiary was Diana Chen (100%).

---
This policy change was requested by Tyler Ross
and approved by Marcus Chen on January 14, 2024.`
                        },
                        "audit_prep.txt": {
                            type: "file",
                            icon: "📄",
                            size: "1.2 KB",
                            date: "Mar 13, 2024",
                            content: `AUDIT PREPARATION NOTES
=======================
April 15, 2024 - External Audit

ITEMS TO REVIEW:
- All consulting contracts (PRIORITY)
- Wire transfers over $10,000
- Tyler's expense reports
- Singapore expansion costs

CONCERNS:
- $2.3M in consulting fees - no contracts on file
- Multiple transfers to Cayman First Bank
- Tyler requested we delay the audit - DENIED

NOTE TO SELF:
If Tyler can't explain the fees, we may need 
to involve forensic accountants.`
                        }
                    }
                },
                "Personal": {
                    type: "folder",
                    children: {
                        "therapy_notes.txt": {
                            type: "file",
                            icon: "📄",
                            size: "0.8 KB",
                            date: "Mar 10, 2024",
                            content: `Session Notes - March 10, 2024
Dr. Rebecca Hayes

Patient expresses significant stress regarding business partnership.
States that "Tyler has been acting strange lately" and that he 
"found some irregularities in the books."

Patient is considering confronting partner about missing funds.
Advised caution and documentation before any accusations.

Next session: March 17, 2024`
                        }
                    }
                },
                "Voicemails": {
                    type: "folder",
                    children: {
                        "voicemail_alex_mar1.txt": {
                            type: "file",
                            icon: "🎤",
                            size: "44 KB",
                            date: "Mar 1, 2024",
                            content: `VOICEMAIL TRANSCRIPT
====================
From: Alex Kim (555-0147)
Date: March 1, 2024 - 6:45 PM
Duration: 0:38

[BEGIN TRANSCRIPT]

Tyler, you piece of s***. You think you can just 
fire me and that's it? I know what you've been doing. 
I have PROOF. Those fake consulting companies? The 
offshore accounts? I copied EVERYTHING before you 
locked me out.

You want to play hardball? Fine. But remember - I 
know where the bodies are buried. Maybe literally, 
soon.

[END TRANSCRIPT]

---
Note: Caller sounded intoxicated.`
                        },
                        "voicemail_diana_mar14.txt": {
                            type: "file",
                            icon: "🎤",
                            size: "21 KB",
                            date: "Mar 14, 2024",
                            content: `VOICEMAIL TRANSCRIPT
====================
From: Diana Chen (555-0199)
Date: March 14, 2024 - 5:30 PM
Duration: 0:22

[BEGIN TRANSCRIPT]

Tyler, it's Diana. I need to talk to you about 
Marcus. Something's going on and I'm worried about 
him. Can you call me back? He's been acting 
paranoid... talking about the audit, about you.

Just... call me, okay?

[END TRANSCRIPT]`
                        },
                        "voicemail_victor_mar12.txt": {
                            type: "file",
                            icon: "🎤",
                            size: "35 KB",
                            date: "Mar 12, 2024",
                            content: `VOICEMAIL TRANSCRIPT
====================
From: Unknown (Blocked Number)
Date: March 12, 2024 - 9:15 PM
Duration: 0:45

[BEGIN TRANSCRIPT]

Mr. Ross. Victor here. I'm calling as a courtesy.

You owe us $347,000. March 20 is the deadline. 
There will be no more extensions.

I like you, Tyler. You've been a good customer. 
But business is business. If you don't pay, we 
will collect. One way or another.

Think carefully about your next move.

[END TRANSCRIPT]`
                        }
                    }
                }
            }
        },
        "Downloads": {
            type: "folder",
            children: {
                "gambling_statement.pdf": {
                    type: "file",
                    icon: "📄",
                    size: "1.4 MB",
                    date: "Mar 12, 2024",
                    content: `LUCKY STAR ONLINE CASINO
Account Statement - Tyler Ross

Account Balance: -$847,000.00
Credit Limit: $500,000.00

PAYMENT DUE: March 20, 2024
AMOUNT DUE: $347,000.00

WARNING: Failure to pay will result in
collection proceedings.

---
[This file was downloaded on March 12, 2024]
[Download source: Email attachment from Lucky Star Casino]`
                },
                "bank_statement_feb.pdf": {
                    type: "file",
                    icon: "📄",
                    size: "2.1 MB",
                    date: "Mar 5, 2024",
                    content: `FIRST NATIONAL BANK
Statement Period: Feb 1-28, 2024
Account: Tyler Ross ****4521

OPENING BALANCE: $45,892.33
CLOSING BALANCE: -$8,234.11

MAJOR TRANSACTIONS:
- Feb 5:  Transfer OUT $25,000 (Lucky Star Casino)
- Feb 12: Transfer OUT $40,000 (Lucky Star Casino)
- Feb 19: Transfer IN  $50,000 (NovaTech Payroll)
- Feb 19: Transfer OUT $50,000 (Lucky Star Casino)
- Feb 26: Transfer OUT $15,000 (Cash Withdrawal)

OVERDRAFT FEES: $224.00

ACCOUNT STATUS: OVERDRAWN
Immediate deposit required to avoid account closure.`
                },
                "flight_options.pdf": {
                    type: "file",
                    icon: "📄",
                    size: "0.5 MB",
                    date: "Mar 14, 2024",
                    content: `SEARCH RESULTS: One-Way Flights
Downloaded: March 14, 2024 - 3:00 AM

SEARCH CRITERIA:
- From: San Francisco (SFO)
- To: George Town, Cayman Islands (GCM)
- Date: March 16, 2024
- Passengers: 1 Adult

RESULTS:
1. American Airlines AA 892
   SFO → MIA → GCM
   Depart: 6:00 AM | Arrive: 8:45 PM
   Price: $1,247 (Economy)

2. Delta DL 445
   SFO → ATL → GCM
   Depart: 7:30 AM | Arrive: 9:15 PM
   Price: $1,389 (Economy)

---
Note: Cayman Islands has no extradition treaty 
with the United States for financial crimes.`
                }
            }
        }
    },

    emails: [
        {
            id: "email1",
            from: "Marcus Chen <marcus@novatech.com>",
            to: "Tyler Ross <tyler@novatech.com>",
            subject: "We need to talk",
            date: "March 14, 2024 - 9:15 AM",
            body: `Tyler,

I've been going through the Q4 financials and something doesn't add up. There's $2.3 million in "consulting fees" that I have no record of approving.

I want to meet tomorrow evening to discuss this. My office, 7:00 PM. Come alone.

This isn't an accusation, but I need answers before the April audit.

- Marcus`
        },
        {
            id: "email2",
            from: "Tyler Ross <tyler@novatech.com>",
            to: "Marcus Chen <marcus@novatech.com>",
            subject: "RE: We need to talk",
            date: "March 14, 2024 - 11:30 AM",
            body: `Marcus,

Of course. I'll be there at 7.

Those fees are legitimate consulting work for the Singapore expansion. I have all the documentation. Happy to walk you through everything.

Don't worry - it'll all make sense once I explain.

Tyler`
        },
        {
            id: "tyler_insurance_email",
            from: "PolicyAdmin@executivelife.com",
            to: "Tyler Ross <tyler@novatech.com>",
            subject: "Beneficiary Change Confirmation",
            date: "January 15, 2024 - 2:00 PM",
            body: `Dear Mr. Ross,

This email confirms that the beneficiary designation for Policy #NVT-2024-0892 (Marcus Chen) has been successfully updated as per your request.

New Designation:
- Primary: Tyler Ross (60%)
- Secondary: Diana Chen (40%)

If you did not authorize this change, please contact us immediately.

Best regards,
Executive Life Insurance`
        },
        {
            id: "email4",
            from: "Diana Chen <diana.chen@gmail.com>",
            to: "Tyler Ross <tyler@novatech.com>",
            subject: "About Marcus",
            date: "March 10, 2024 - 8:45 PM",
            body: `Tyler,

I know about the affair. I know about everything.

But I'm not going to do anything stupid. Marcus and I will work it out, or we won't. That's between us.

I just wanted you to know that I know. Don't pretend around me anymore.

Diana`
        },
        {
            id: "email5",
            from: "Alex Kim <alexkim.dev@gmail.com>",
            to: "Tyler Ross <tyler@novatech.com>",
            subject: "You'll regret this",
            date: "March 1, 2024 - 5:30 PM",
            body: `Tyler,

You and Marcus ruined my career. 8 years I gave to that company, and you fire me over ONE mistake?

This isn't over. I have copies of everything. Every shady deal, every offshore account. If I go down, I'm taking NovaTech with me.

Watch your back.

Alex`
        },
        // NEW EMAILS - Red herrings and expanded story
        {
            id: "diana_lawyer",
            from: "Jennifer Walsh <jwalsh@walshlawgroup.com>",
            to: "Diana Chen <diana.chen@gmail.com>",
            subject: "RE: Initial Consultation - Divorce Proceedings",
            date: "March 8, 2024 - 4:15 PM",
            body: `Dear Diana,

Thank you for meeting with me yesterday. I understand this is a difficult time.

Based on what you've shared, here are the key points:

1. The prenuptial agreement is enforceable, BUT...
2. If infidelity can be proven, you may be entitled to additional assets
3. His life insurance policy lists you as 40% beneficiary (down from 100% - we should investigate this change)

I recommend we proceed carefully. Document everything. If you decide to move forward, we can file papers within 2 weeks.

Please let me know how you'd like to proceed.

Jennifer Walsh, Esq.
Walsh Law Group`
        },
        {
            id: "diana_friend",
            from: "Sarah Mitchell <sarahm@gmail.com>",
            to: "Diana Chen <diana.chen@gmail.com>",
            subject: "RE: I can't do this anymore",
            date: "March 12, 2024 - 10:30 PM",
            body: `Diana,

I'm so sorry. I had no idea it was this bad.

Look, I know you're angry, but please don't do anything you'll regret. Think about the kids, think about your future.

Marcus is a jerk, but he's not worth ruining your life over. Let the lawyers handle it.

Call me if you need to talk. Any time.

Love,
Sarah`
        },
        {
            id: "alex_lawyer",
            from: "Alex Kim <alexkim.dev@gmail.com>",
            to: "Robert Chen <rchen@employmentlaw.com>",
            subject: "RE: Wrongful Termination Case",
            date: "March 10, 2024 - 2:00 PM",
            body: `Robert,

Thanks for taking my case. I've attached all the documentation you requested.

To clarify: I did access the financial files, but only because I suspected fraud. The "unauthorized access" charge is bogus - I had legitimate concerns about money laundering through fake consulting firms.

I want to be clear: I'm not interested in violence or revenge. I just want my reputation restored and fair compensation.

The threatening email I sent Tyler was in the heat of the moment. I've calmed down. Let's handle this professionally.

Alex Kim`
        },
        {
            id: "sam_marcus",
            from: "Sam Chen <samchen@gmail.com>",
            to: "Marcus Chen <marcus@novatech.com>",
            subject: "I'm sorry",
            date: "March 12, 2024 - 9:00 AM",
            body: `Marcus,

I've been thinking a lot about our fight at Christmas. I said things I didn't mean.

I know the trust situation is complicated, and I know I haven't always been responsible with money. You had every right to protect Mom and Dad's legacy.

Can we meet when I'm back in town? I'm flying to Boston for a conference March 14-17, but I'd love to grab dinner when I return.

You're still my brother. That matters more than money.

Sam`
        },
        {
            id: "sam_flight",
            from: "Delta Airlines <noreply@delta.com>",
            to: "Sam Chen <samchen@gmail.com>",
            subject: "Flight Confirmation - SFO to BOS",
            date: "March 13, 2024 - 11:00 AM",
            body: `FLIGHT CONFIRMATION

Passenger: Samuel Chen
Confirmation: DL8847291

OUTBOUND:
March 14, 2024
DL 892: San Francisco (SFO) → Boston (BOS)
Depart: 6:00 AM | Arrive: 2:30 PM

RETURN:
March 17, 2024
DL 445: Boston (BOS) → San Francisco (SFO)
Depart: 10:00 AM | Arrive: 1:30 PM

Thank you for flying Delta!`
        },
        {
            id: "tyler_casino",
            from: "Collections <collections@luckystar-casino.com>",
            to: "Tyler Ross <tyler@novatech.com>",
            subject: "FINAL NOTICE - Account Past Due",
            date: "March 10, 2024 - 9:00 AM",
            body: `LUCKY STAR CASINO - FINAL NOTICE

Account Holder: Tyler Ross
Amount Due: $347,000.00
Due Date: March 20, 2024

Mr. Ross,

This is your FINAL NOTICE before we begin collection proceedings.

You have been a valued customer, but we can no longer extend credit. Full payment is required by March 20.

Failure to pay will result in:
- Legal action
- Wage garnishment 
- Credit report notification
- Potential criminal referral

We trust you will resolve this matter promptly.

Lucky Star Collections Department`
        },
        {
            id: "tyler_draft",
            from: "Tyler Ross <tyler@novatech.com>",
            to: "",
            subject: "[DRAFT] I'm sorry",
            date: "March 14, 2024 - 11:45 PM",
            body: `[UNSENT DRAFT]

To whoever finds this,

I never meant for any of it to go this far. The gambling started small - just a way to blow off steam. Then the losses piled up, and I got desperate.

The consulting fees were supposed to be a temporary fix. I was going to pay it all back once I hit a big win. But the wins never came.

When Marcus told me about the audit, I knew it was over. Everything I built, everything I worked for - gone.

I made a choice. I chose survival.

I'm sorry.

[DRAFT - NOT SENT]`
        },
        {
            id: "board_memo",
            from: "Marcus Chen <marcus@novatech.com>",
            to: "NovaTech Board Members",
            subject: "Confidential: CFO Concerns",
            date: "March 13, 2024 - 3:00 PM",
            body: `CONFIDENTIAL - BOARD EYES ONLY

Board Members,

I'm scheduling an emergency meeting for March 18 to discuss concerns about our financial operations.

Without going into details via email, I've discovered irregularities that require immediate attention. I've already scheduled a private discussion with Tyler for tomorrow evening to give him a chance to explain.

If his explanations are unsatisfactory, we may need to involve forensic accountants and potentially law enforcement.

Please keep this confidential until our meeting.

Marcus Chen
CEO, NovaTech Solutions`
        }
    ],

    chats: {
        "Diana Chen": {
            avatar: "👩",
            messages: [
                { sender: "them", text: "Are you coming home for dinner tonight?", time: "March 14, 6:30 PM" },
                { sender: "me", text: "Late meeting with Marcus. Don't wait up.", time: "March 14, 6:35 PM" },
                { sender: "them", text: "Is everything okay? You've been stressed lately.", time: "March 14, 6:40 PM" },
                { sender: "me", text: "Just business stuff. Nothing to worry about.", time: "March 14, 6:42 PM" },
                { sender: "them", text: "Tyler, I know about the gambling.", time: "March 14, 6:45 PM" },
                { sender: "them", text: "Marcus told me. He's worried about you.", time: "March 14, 6:45 PM" },
                { sender: "me", text: "Marcus should mind his own business.", time: "March 14, 6:50 PM" },
                { sender: "them", text: "He's your friend. He wants to help.", time: "March 14, 6:52 PM" },
                { sender: "me", text: "I don't need his help. I have it under control.", time: "March 14, 6:55 PM" }
            ]
        },
        "Victor (Bookie)": {
            avatar: "🎰",
            messages: [
                { sender: "them", text: "Payment is due March 20. No more extensions.", time: "March 10, 2:00 PM" },
                { sender: "me", text: "I'll have it. I just need a few more days.", time: "March 10, 2:15 PM" },
                { sender: "them", text: "You said that last month. And the month before.", time: "March 10, 2:16 PM" },
                { sender: "them", text: "347K by the 20th or we start collection.", time: "March 10, 2:17 PM" },
                { sender: "me", text: "I WILL have it. Something big is happening soon.", time: "March 10, 2:20 PM" },
                { sender: "them", text: "It better. For your sake.", time: "March 10, 2:22 PM" }
            ]
        },
        "Sam Chen": {
            avatar: "👤",
            messages: [
                { sender: "them", text: "Is what I heard true? Marcus changed the trust?", time: "March 5, 10:00 AM" },
                { sender: "me", text: "I don't know the details, Sam. That's family business.", time: "March 5, 10:30 AM" },
                { sender: "them", text: "After everything I did for him? He cuts me out?", time: "March 5, 10:32 AM" },
                { sender: "them", text: "I should have known. Blood means nothing to him.", time: "March 5, 10:33 AM" },
                { sender: "me", text: "Take it up with Marcus. I'm staying out of this.", time: "March 5, 10:45 AM" }
            ]
        },
        // NEW CHATS
        "Mike (Unknown)": {
            avatar: "🕶️",
            messages: [
                { sender: "them", text: "You called about a problem?", time: "March 13, 11:00 PM" },
                { sender: "me", text: "Yeah. I need advice.", time: "March 13, 11:05 PM" },
                { sender: "them", text: "Go on.", time: "March 13, 11:06 PM" },
                { sender: "me", text: "Someone's about to find out about some money issues. Big ones.", time: "March 13, 11:10 PM" },
                { sender: "them", text: "How big?", time: "March 13, 11:11 PM" },
                { sender: "me", text: "2 million. Maybe more.", time: "March 13, 11:12 PM" },
                { sender: "them", text: "That's serious. What are your options?", time: "March 13, 11:15 PM" },
                { sender: "me", text: "I'm running out of options. That's why I called you.", time: "March 13, 11:18 PM" },
                { sender: "them", text: "There's always an option. Depends on how far you're willing to go.", time: "March 13, 11:20 PM" },
                { sender: "me", text: "I'm desperate.", time: "March 13, 11:22 PM" },
                { sender: "them", text: "We should talk in person. Tomorrow.", time: "March 13, 11:25 PM" }
            ]
        },
        "Alex Kim": {
            avatar: "💻",
            messages: [
                { sender: "them", text: "I know what you've been doing Tyler.", time: "March 2, 4:00 PM" },
                { sender: "me", text: "I don't know what you're talking about.", time: "March 2, 4:15 PM" },
                { sender: "them", text: "The consulting fees. I saw the files before you fired me.", time: "March 2, 4:16 PM" },
                { sender: "them", text: "Fake companies. Offshore accounts. Ring any bells?", time: "March 2, 4:17 PM" },
                { sender: "me", text: "You accessed those files illegally. That's why you were fired.", time: "March 2, 4:20 PM" },
                { sender: "them", text: "I have copies. My lawyer has copies.", time: "March 2, 4:22 PM" },
                { sender: "me", text: "Is that a threat?", time: "March 2, 4:25 PM" },
                { sender: "them", text: "It's a fact. See you in court.", time: "March 2, 4:30 PM" }
            ]
        }
    },

    photos: [
        {
            id: "sec_1",
            icon: "📸",
            album: "Security",
            caption: "Office security cam - Mar 15, 6:45 PM",
            description: "Tyler Ross entering Marcus's office. He is carrying a leather briefcase and a travel mug.",
            meta: "NovaTech HQ | Camera 05 | 18:45:12"
        },
        {
            id: "sec_2",
            icon: "📸",
            album: "Security",
            caption: "Office security cam - Mar 15, 7:50 PM",
            description: "Tyler Ross leaving Marcus's office. He looks agitated and is checking his watch frequently.",
            meta: "NovaTech HQ | Camera 05 | 19:50:44"
        },
        {
            id: "sec_3",
            icon: "📸",
            album: "Security",
            caption: "Parking garage - Mar 15, 8:05 PM",
            description: "Tyler's silver sedan leaving the parking structure at high speed.",
            meta: "NovaTech HQ | Garage Exit | 20:05:33"
        },
        {
            id: "desk_cup",
            icon: "☕",
            album: "Downloads",
            caption: "Police Photo: Victim's Desk",
            description: "Close-up of the coffee mug found on Marcus Chen's desk. Residue analysis pending.",
            meta: "Evidence Registry: #EP-992-B"
        },
        {
            id: "personal_1",
            icon: "📷",
            album: "Personal",
            caption: "Family Dinner - Jan 2024",
            description: "Marcus and Diana at their 12th anniversary dinner. They both look happy here.",
            meta: "Location: Oceanside Grill | Jan 15, 2024"
        },
        {
            id: "personal_2",
            icon: "📷",
            album: "Personal",
            caption: "Weekend Getaway",
            description: "Tyler and Marcus at a tech conference last year. They were best friends for over a decade.",
            meta: "Location: Las Vegas | Nov 2023"
        },
        {
            id: "personal_3",
            icon: "📷",
            album: "Personal",
            caption: "The Team",
            description: "Founding team of NovaTech: Marcus, Tyler, and Alex Kim. Taken in the first office.",
            meta: "Location: Palo Alto Garage | June 2016"
        },
        {
            id: "sec_4",
            icon: "📸",
            album: "Security",
            caption: "Office hallway - Mar 12, 10:15 PM",
            description: "Tyler Ross entering the office late at night. He is not carrying anything.",
            meta: "NovaTech HQ | Hallway North | 22:15:00"
        }
    ],

    calendar: {
        month: "March 2024",
        events: [
            { day: 1, category: "Work", title: "Alex Fired", description: "HR meeting - Alex Kim termination. Reason: Unauthorized access to financial systems." },
            { day: 5, category: "Legal", title: "Trust Lawyer", description: "Meeting with estate lawyer regarding trust amendments. Sam to be removed as beneficiary." },
            { day: 10, category: "Personal", title: "Therapy 4pm", description: "Weekly therapy session with Dr. Hayes. Discussing business stress and partner concerns." },
            { day: 12, category: "Work", title: "Collections Call", description: "Victor called about payment. Need $347K by the 20th. No more extensions." },
            { day: 14, category: "Work", title: "Meeting Prep", description: "Prepare documentation for meeting with Marcus. Need to explain the consulting fees. Can't let him see the real numbers." },
            { day: 15, category: "Work", title: "Marcus Meeting 7PM", description: "Meeting with Marcus to discuss financials. This is it. One way or another, this ends tonight." },
            { day: 17, category: "Work", title: "Board Meeting", description: "Quarterly board meeting. Presenting Q1 results." },
            { day: 20, category: "Personal", title: "VICTOR PAYMENT", description: "Lucky Star Casino payment deadline. $347,000 or the 'fix' is in." },
            { day: 8, category: "Legal", title: "Jennifer Walsh", description: "Diana's lawyer called office phone. Left message." },
            { day: 13, category: "Personal", title: "Flight Search", description: "Looked up options for GCM. Private banking inquiry confirmed." }
        ]
    },

    browserHistory: [
        { title: "Lucky Star Casino - Online Poker", url: "www.luckystar-casino.com/poker", time: "March 14, 11:00 PM", suspicious: false },
        { title: "How long does ethylene glycol take to work", url: "www.google.com/search?q=ethylene+glycol+symptoms+timeline", time: "March 13, 2:30 AM", suspicious: true },
        { title: "Life insurance beneficiary rules", url: "www.google.com/search?q=life+insurance+beneficiary+spouse", time: "March 12, 9:00 PM", suspicious: true },
        { title: "Buy antifreeze in bulk", url: "www.autozone.com/antifreeze", time: "March 12, 9:30 PM", suspicious: true },
        { title: "NovaTech Company Valuation", url: "www.bloomberg.com/novatech-valuation", time: "March 10, 3:00 PM", suspicious: false },
        { title: "Can police trace poison purchases", url: "www.google.com/search?q=can+police+trace+poison", time: "March 11, 1:00 AM", suspicious: true },
        { title: "Offshore banking Cayman Islands", url: "www.caymanfirst.com/private-banking", time: "March 8, 4:00 PM", suspicious: true },
        { title: "How to disappear completely", url: "www.reddit.com/r/privacy/disappear", time: "March 14, 3:00 AM", suspicious: true },
        { title: "One way flights to non-extradition countries", url: "www.google.com/search?q=countries+no+extradition+usa", time: "March 14, 3:15 AM", suspicious: true }
    ],

    bookmarks: [
        { id: "casino", name: "Lucky Star Casino", url: "www.luckystar-casino.com", icon: "🎰" },
        { id: "bank", name: "First National Bank", url: "www.firstnational.com", icon: "🏦" },
        { id: "novatech", name: "NovaTech Portal", url: "portal.novatech.com", icon: "💼" },
        { id: "social", name: "FaceLink", url: "www.facelink.com", icon: "👥" }
    ],

    browserPages: {
        casino: {
            icon: "🎰",
            title: "Lucky Star Casino",
            headerColor: "#1a0a2e",
            content: `
                <div style="background: #2d1a4a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #fbbf24;">⚠️ ACCOUNT SUSPENDED</h3>
                    <p style="margin-top: 10px;">Dear Tyler Ross,</p>
                    <p>Your account has been suspended due to outstanding balance.</p>
                    <p style="color: #ef4444; font-size: 24px; margin: 15px 0;"><strong>Amount Due: $347,000.00</strong></p>
                    <p>Payment deadline: <strong>March 20, 2024</strong></p>
                    <p style="margin-top: 15px; color: #f87171;">Failure to pay will result in collection proceedings.</p>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <h4>Recent Activity</h4>
                    <p style="color: var(--text-dim); margin-top: 10px;">• March 10: Lost $45,000 - Texas Hold'em</p>
                    <p style="color: var(--text-dim);">• March 8: Lost $23,000 - Blackjack</p>
                    <p style="color: var(--text-dim);">• March 5: Lost $67,000 - High Stakes Poker</p>
                </div>
            `
        },
        bank: {
            icon: "🏦",
            title: "First National Bank - Account Overview",
            headerColor: "#0a2540",
            content: `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="color: var(--text-dim);">Account Holder: Tyler Ross</p>
                    <p style="color: var(--text-dim);">Account: ****4521</p>
                    <hr style="border-color: var(--border-color); margin: 15px 0;">
                    <p style="font-size: 14px;">Available Balance:</p>
                    <p style="font-size: 28px; color: #ef4444;"><strong>-$12,847.33</strong></p>
                    <p style="color: #ef4444; font-size: 12px;">⚠️ OVERDRAWN - Immediate deposit required</p>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <h4>Recent Transactions</h4>
                    <p style="color: var(--text-dim); margin-top: 10px;">Mar 14: Wire Transfer OUT - $50,000 (Cayman First Bank)</p>
                    <p style="color: var(--text-dim);">Mar 12: ATM Withdrawal - $500</p>
                    <p style="color: var(--text-dim);">Mar 10: Transfer to Lucky Star - $25,000</p>
                    <p style="color: var(--text-dim);">Mar 8: Transfer to Lucky Star - $40,000</p>
                </div>
            `
        },
        novatech: {
            icon: "💼",
            title: "NovaTech Employee Portal",
            headerColor: "#0f3460",
            content: `
                <div style="background: rgba(233, 69, 96, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid var(--accent);">
                    <strong>⚠️ NOTICE:</strong> Mandatory financial audit scheduled for April 15, 2024. 
                    All department heads must prepare documentation.
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                    <h4>Quick Links</h4>
                    <p style="margin-top: 10px;">📊 Financial Reports</p>
                    <p>📋 Expense Reports</p>
                    <p>👥 HR Portal</p>
                    <p>📧 Internal Mail</p>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <h4>Company News</h4>
                    <p style="color: var(--text-dim); margin-top: 10px;">Mar 15: Quarterly board meeting scheduled</p>
                    <p style="color: var(--text-dim);">Mar 10: CEO Marcus Chen announces expansion plans</p>
                    <p style="color: var(--text-dim);">Mar 1: Alex Kim terminated (Security violation)</p>
                </div>
            `
        },
        social: {
            icon: "👥",
            title: "FaceLink - Tyler Ross",
            headerColor: "#1877f2",
            content: `
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">👤</div>
                    <div>
                        <h3>Tyler Ross</h3>
                        <p style="color: var(--text-dim);">CFO at NovaTech Solutions</p>
                        <p style="color: var(--text-dim);">San Francisco, CA</p>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: var(--text-dim); font-size: 12px;">March 14 at 11:45 PM</p>
                    <p style="margin-top: 8px;">Sometimes you have to make hard choices to protect what matters most. Everything will work out. 🙏</p>
                    <p style="color: var(--text-dim); margin-top: 10px;">2 likes • 0 comments</p>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <p style="color: var(--text-dim); font-size: 12px;">March 10 at 3:00 PM</p>
                    <p style="margin-top: 8px;">Great meeting with the NovaTech team today! Exciting things ahead. 🚀</p>
                    <p style="color: var(--text-dim); margin-top: 10px;">15 likes • 3 comments</p>
                </div>
            `
        }
    },

    recycledFiles: [
        {
            name: "draft_resignation.txt",
            icon: "📄",
            content: `[DELETED FILE - RECOVERED]

To the Board of Directors,

I am writing to tender my resignation as CFO of NovaTech Solutions, effective immediately.

Recent events have made it impossible for me to continue in this role. I take full responsibility for

[DOCUMENT INCOMPLETE - FILE WAS DELETED BEFORE COMPLETION]

---
File deleted: March 14, 2024 - 11:45 PM
Original location: Documents/Personal/`
        },
        {
            name: "receipt_autozone.png",
            icon: "🧾",
            content: `[DELETED IMAGE - METADATA RECOVERED]

AutoZone Receipt
Date: March 12, 2024
Time: 10:15 AM

Item: Peak Antifreeze 1 Gallon x2
Price: $34.98

Payment: Cash

---
File deleted: March 15, 2024 - 8:00 PM`
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined') {
    module.exports = CASE_DATA;
}

