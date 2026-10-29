import { ContactEmail, H2, LegalPage, UL } from '@/components/legal-page'

export const metadata = {
  title: 'Privacy Policy — Lobbi',
  description: 'What Lobbi collects, who can see it, and how to ask us to delete it.',
}

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Your data" title="Privacy Policy">
      <p>
        Lobbi helps PC gamers in India find teammates. This page explains, in plain words, what we collect, who can see it,
        and what you can ask us to do.
      </p>

      <H2>What we collect</H2>
      <UL>
        <li><strong className="text-foreground">Waitlist:</strong> your email address.</li>
        <li>
          <strong className="text-foreground">Sign in with Discord:</strong> Discord shares your Discord username, your email address and a link
          to your profile picture with us. Our login system stores this.
        </li>
        <li>
          <strong className="text-foreground">Your profile:</strong> the display name you choose, your city, the games and ranks you pick, your usual
          play times, and your confirmation that you are 18 or older.
        </li>
        <li>
          <strong className="text-foreground">Lobbies:</strong> lobbies you create or join (game, title, start time, city) and who is in them.
        </li>
        <li><strong className="text-foreground">Reports</strong> you send about other players or lobbies.</li>
        <li>
          <strong className="text-foreground">Technical data:</strong> a login cookie that keeps you signed in. To stop spam on the waitlist form we count
          tries per connection. We store only a scrambled version of your IP address for this, and we delete these counters regularly.
          Our hosting providers may also keep normal server logs.
        </li>
        <li>
          <strong className="text-foreground">Page views:</strong> we use Vercel Analytics to count visits. It is built to work without cookies
          and does not follow you around other websites.
        </li>
      </UL>
      <p>We do not show ads and we do not sell your data.</p>

      <H2>Who can see what</H2>
      <UL>
        <li>
          <strong className="text-foreground">Other signed-in players:</strong> your display name, city, games, ranks and play times, and the lobbies
          you are in (title, game, time, city).
        </li>
        <li>
          <strong className="text-foreground">Only people in the same lobby as you:</strong> your Discord username. They can see it while the lobby is
          open or full, until 12 hours after it starts. Closing a lobby ends this.
        </li>
        <li><strong className="text-foreground">Nobody else:</strong> your email address and your Discord account details are never shown to other players.</li>
        <li><strong className="text-foreground">Us:</strong> the people who run Lobbi can see what is stored in the database, including reports.</li>
      </UL>
      <p>Anyone in a lobby could copy your Discord username. Only join lobbies you are comfortable being in.</p>

      <H2>Why we use your data</H2>
      <p>To let you sign in, show you players and lobbies, tell waitlist members when Lobbi opens, keep the service safe (reports, spam limits), and fix problems.</p>

      <H2>Where it is stored</H2>
      <p>
        Your data is kept with companies that help us run Lobbi: Supabase (database and login), Vercel (hosting and page-view counts) and Discord
        (the sign-in itself). Our database is hosted in India.
      </p>

      <H2>How long we keep it</H2>
      <UL>
        <li>Your account data stays until you ask us to delete it.</li>
        <li>Waitlist emails stay until Lobbi opens or you ask us to remove yours.</li>
        <li>Reports are kept for as long as we need them to keep people safe.</li>
      </UL>

      <H2 id="contact">Your choices and how to reach us</H2>
      <p>
        You can ask us to show you your data, correct it or delete it, including your account and your waitlist email. There is no delete button yet,
        so please email <ContactEmail />. We aim to answer within 30 days. You can also edit your profile any time on the Profile page.
      </p>

      <H2>Age</H2>
      <p>Lobbi is only for people who are 18 or older. If we find out that someone is younger, we will remove their account and data. If you see someone who looks under 18, please report them.</p>

      <H2>Changes</H2>
      <p>If we change this page, we will update the date at the top. If the change is big, we will tell you on the site.</p>
    </LegalPage>
  )
}
