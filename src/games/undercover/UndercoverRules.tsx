export function UndercoverRules() {
  return (
    <div>
      <h3>What is Undercover?</h3>
      <p>
        Undercover is a word-based social deduction game played on a single phone. Players receive
        similar-but-different words and must talk their way through rounds of description and
        voting to work out who&apos;s an Agent, who&apos;s a Spy, and who is the mysterious Mr.
        White with no word at all.
      </p>

      <h3>The Roles</h3>
      <p>
        <strong>🕵️ Agents (majority)</strong> get the Agent word (for example, &quot;Coffee&quot;)
        and try to spot the fakes. They see their role as &quot;Agent / Spy&quot; and must figure
        out which side they&apos;re really on from how others talk.
      </p>
      <p>
        <strong>🎭 Spy</strong> gets a similar but different word (for example,
        &quot;Tea&quot;&nbsp;when Agents have &quot;Coffee&quot;). They also see
        &quot;Agent / Spy&quot; and must blend in while nudging suspicion away from themselves.
      </p>
      <p>
        <strong>⚪ Mr. White</strong> gets no word at all. They have to listen carefully and fake it
        — if they&apos;re voted out, they get one shot to guess the Agent word and instantly win.
      </p>

      <h3>Setup</h3>
      <ul>
        <li>Choose a total number of players (minimum 4).</li>
        <li>Enter each player&apos;s name as a chip. You must add exactly one name per player.</li>
        <li>
          Choose how many <strong>Mr. Whites</strong> (default 1, can be 0).
        </li>
        <li>
          Choose how many <strong>Spies</strong> (default 0, can be 0).
        </li>
        <li>
          <strong>Agents</strong> are auto-calculated as <code>Total - MrWhite - Spy</code> and
          must always be greater than <code>MrWhite + Spy</code>. If you try to add too many Spies
          or Mr. Whites, the game will adjust the total players to keep this rule true.
        </li>
      </ul>

      <h3>Role Assignment</h3>
      <ul>
        <li>The game picks a random word pair (e.g. &quot;Coffee&quot; / &quot;Tea&quot;).</li>
        <li>A coin flip decides which word belongs to Agents and which to Spies.</li>
        <li>
          It builds a list of roles (Mr. Whites, Spies, Agents), shuffles them, and assigns one
          role per player in the order you entered their names.
        </li>
        <li>A random player is chosen to view their role first; others follow in a circle.</li>
      </ul>

      <h3>Phone Passing &amp; Role Viewing</h3>
      <ul>
        <li>The phone is passed around. Only the current player looks at the screen.</li>
        <li>
          For each player the phone shows: &quot;Pass the phone to [Name]&quot; → they tap
          &quot;👁️ Reveal My Role&quot;.
        </li>
        <li>
          <strong>Mr. White</strong> sees their avatar, &quot;You&apos;re Mr. White&quot; and
          &quot;Blend in and guess the word!&quot; with no word shown.
        </li>
        <li>
          <strong>Agents / Spies</strong> see a shared &quot;Agent / Spy&quot; label and their
          secret word in large text, but not which team it belongs to.
        </li>
        <li>After viewing, they tap to pass the phone to the next player. The last player starts the game.</li>
      </ul>

      <h3>Round Flow</h3>
      <ol>
        <li>
          <strong>Describe your word</strong>: players, in some order, say a 1–2 word clue about
          their word without being too obvious.
        </li>
        <li>
          <strong>Discuss &amp; vote</strong>: everyone debates who seems suspicious and agrees on
          one player to eliminate.
        </li>
        <li>
          <strong>Eliminate</strong>: tap &quot;Eliminate Player&quot;, select the chosen player,
          and confirm.
        </li>
        <li>
          <strong>Role reveal</strong>: the app shows that player&apos;s true role (Agent, Spy, or
          Mr. White) — but not their word.
        </li>
        <li>
          <strong>After elimination</strong>:
          <ul>
            <li>
              If it was <strong>Mr. White</strong>, they get one guess at the Agent word. Correct →
              Mr. White wins; wrong → Agents win.
            </li>
            <li>
              If it was <strong>Spy or Agent</strong>, the app checks win conditions. If no team has
              won yet, a new round begins with a new starting speaker.
            </li>
          </ul>
        </li>
      </ol>

      <h3>Win Conditions</h3>
      <ul>
        <li>
          <strong>Agents win</strong> when all Spies and all Mr. Whites have been eliminated (or Mr.
          White guesses wrong).
        </li>
        <li>
          <strong>Spy wins</strong> when all Mr. Whites are gone and only 2–3 players remain, with
          at least one Spy still alive.
        </li>
        <li>
          <strong>Mr. White wins</strong> if they are eliminated and correctly guess the Agent
          word.
        </li>
      </ul>

      <h3>Strategy Hints</h3>
      <p>
        Be just vague enough to hide your exact word, but not so vague that you look like Mr.
        White. Listen for tiny differences in wording that might reveal which side someone is on,
        and remember: Mr. White is the only one who knows for sure they&apos;re not holding a
        word…
      </p>
    </div>
  );
}

