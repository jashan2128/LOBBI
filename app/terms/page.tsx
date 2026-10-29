import { ContactEmail, H2, LegalPage, UL } from '@/components/legal-page'

export const metadata = {
  title: 'Terms of Use — Lobbi',
  description: 'The simple rules for using Lobbi.',
}

export default function TermsPage() {
  return (
    <LegalPage eyebrow="The rules" title="Terms of Use">
      <p>By using Lobbi you agree to these terms. They are written to be short and clear. If you do not agree, please do not use Lobbi.</p>

      <H2>Who can use Lobbi</H2>
      <UL>
        <li>You must be 18 or older.</li>
        <li>You sign in with your own Discord account. One account per person.</li>
        <li>What you put in your profile must be true enough that other players are not misled.</li>
      </UL>

      <H2>What Lobbi is</H2>
      <p>
        Lobbi is a place to find teammates. Players create lobbies, and other players join them. We do not run the games, and we are not part of
        anything that happens between players. We cannot promise that anyone will show up, play well, or behave well.
      </p>

      <H2>Be decent</H2>
      <p>Do not:</p>
      <UL>
        <li>harass, threaten or abuse anyone, or use hate speech or sexual content;</li>
        <li>cheat, use hacks, boost accounts, or sell or trade accounts;</li>
        <li>spam, advertise, or run scams;</li>
        <li>pretend to be someone else, or share other people&rsquo;s private information;</li>
        <li>create fake lobbies or abuse the limits we set;</li>
        <li>use Lobbi if you are under 18.</li>
      </UL>

      <H2>Discord usernames</H2>
      <p>
        When you are in a lobby you can see the other players&rsquo; Discord usernames, and they can see yours. Use them only to team up for that lobby.
        Do not share them, collect them, or join lobbies just to gather usernames. Doing this can get your account removed.
      </p>

      <H2>Your content</H2>
      <p>
        Your display name, profile details and lobby titles are visible to other players. You are responsible for what you write. We may remove
        anything that breaks these terms.
      </p>

      <H2>Reports and enforcement</H2>
      <p>
        Players can report profiles and lobbies. We may remove content, close lobbies, limit what an account can do, or end an account if these rules
        are broken. We may do this without warning. We may not reply to every report.
      </p>

      <H2>Limits</H2>
      <p>To keep Lobbi fair, we set limits such as how many active lobbies you can have and how fast you can create them. We can change these limits.</p>

      <H2>Stay safe</H2>
      <p>
        Lobbi is for playing games online. Do not share your phone number, address, school or other personal details with people you just met. If someone makes you
        uncomfortable, leave the lobby and report them.
      </p>

      <H2>No guarantees</H2>
      <p>
        Lobbi is provided as it is. It may have bugs or be offline sometimes. To the extent the law allows, we are not responsible for losses that come
        from using Lobbi or from things other players do.
      </p>

      <H2>Ending your use</H2>
      <p>You can stop using Lobbi at any time. To delete your account and data, email us (see below). We can also end access for people who break these terms.</p>

      <H2>Changes and law</H2>
      <p>We may update these terms and will change the date at the top when we do. These terms follow the laws of India.</p>

      <H2>Contact</H2>
      <p>
        Questions or problems: <ContactEmail />.
      </p>
    </LegalPage>
  )
}
