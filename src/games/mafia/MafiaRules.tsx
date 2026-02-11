export function MafiaRules() {
  return (
    <div>
      <h3>What is Mafia?</h3>
      <p>
        Mafia is a classic social deduction game of hidden roles, bluffing, and logic. One person
        acts as the Game Master and never plays; everyone else is either on the Mafia team or the
        Civilian team with special roles. The game alternates between Nights (secret actions) and
        Days (public discussion and voting).
      </p>

      <h3>Mafia Team (Bad Guys)</h3>
      <p>
        <strong>🔪 Mafia</strong> wake up together at night and silently agree on one player to
        kill. They win if they ever equal or outnumber all non-Mafia players (Civilians plus
        special roles).
      </p>

      <h3>Civilian Team (Good Guys)</h3>
      <p>
        <strong>😇 Doctor</strong> is always in the game. Each night the Doctor chooses one player
        (including themselves) to save; if that player is the Mafia&apos;s target, nobody dies.
      </p>
      <p>
        <strong>🕵️ Detective</strong> (optional) may investigate one player each night. The Game
        Master silently answers YES if they are Mafia, NO otherwise.
      </p>
      <p>
        <strong>🤡 Jester</strong> (optional) is on their own team. Their goal is to get voted out
        during the Day. If they succeed, they win immediately and take one other player with them.
      </p>
      <p>
        <strong>💣 Bomber</strong> (optional) looks like a normal Civilian at night. If the Bomber
        is voted out during the Day, they take one other player with them; if they are killed by
        Mafia at night, the bomb does not trigger.
      </p>
      <p>
        <strong>💖 Lover</strong> (optional) chooses one player to protect permanently on Night 1.
        If that protected player would die (by Mafia kill or by vote), the Lover dies instead and
        the protected player survives.
      </p>
      <p>
        <strong>👥 Civilians</strong> have no special powers. They listen, talk, and vote to find
        and eliminate the Mafia.
      </p>

      <h3>Setup</h3>
      <ul>
        <li>Choose 5–15 playing players (not including the Game Master).</li>
        <li>Enter a name for every player in numbered inputs.</li>
        <li>
          Enter the Game Master&apos;s name separately – they narrate and never play or receive a
          role.
        </li>
        <li>
          Configure roles: 1 Doctor, 0–5 Mafia, and optional Detective, Jester, Bomber, Lover.
          Civilians fill the remaining slots; there must be at least 1 Civilian.
        </li>
      </ul>

      <h3>Role Assignment &amp; Viewing</h3>
      <ul>
        <li>The app builds a role list and shuffles it, then assigns roles to each player name.</li>
        <li>
          The phone is passed around; each player privately views their role card while others close
          their eyes.
        </li>
        <li>After all players have seen their roles, the phone returns to the Game Master.</li>
      </ul>

      <h3>Night Phase</h3>
      <ol>
        <li>Everyone closes their eyes.</li>
        <li>
          Mafia wake up, silently pick one victim, and go back to sleep. The Game Master notes their
          choice.
        </li>
        <li>
          Doctor wakes up and points to someone to save. The Game Master notes this choice and the
          Doctor sleeps.
        </li>
        <li>
          If the Detective is alive, they wake, pick someone to investigate, and the Game Master
          silently answers YES/NO about Mafia status.
        </li>
        <li>
          On Night 1 only, if the Lover exists, they wake and choose one player to protect
          permanently.
        </li>
        <li>The Game Master then taps to complete the Night and move to Morning.</li>
      </ol>

      <h3>Morning Results</h3>
      <ul>
        <li>
          If Mafia&apos;s victim is protected by the Lover, the Lover dies instead and the victim
          survives.
        </li>
        <li>
          If the Doctor saved the victim, nobody dies and the app announces that the Doctor made a
          save.
        </li>
        <li>
          Otherwise, the victim dies and the app announces that they were killed by the Mafia.
        </li>
      </ul>

      <h3>Day Phase</h3>
      <ul>
        <li>All living players open their eyes and the Game Master announces the night result.</li>
        <li>
          Players discuss, accuse, defend, and eventually vote on one player to eliminate, or decide
          to skip.
        </li>
        <li>
          The Game Master records the chosen player in the app as the Day elimination, or skips if
          no one is to be eliminated.
        </li>
      </ul>

      <h3>Special Day Eliminations</h3>
      <ul>
        <li>
          <strong>Jester voted out</strong>: the Jester wins immediately and chooses one player to
          take with them. The game ends with Jester&apos;s solo victory.
        </li>
        <li>
          <strong>Bomber voted out</strong>: the Bomber chooses one player to take with them. Both
          die, then the game checks if Mafia or Civilians have won; otherwise, the game continues.
        </li>
      </ul>

      <h3>Win Conditions</h3>
      <ul>
        <li>
          <strong>Civilians win</strong> when all Mafia are dead.
        </li>
        <li>
          <strong>Mafia win</strong> when the number of alive Mafia is greater than or equal to the
          number of alive non-Mafia.
        </li>
        <li>
          <strong>Jester wins</strong> as a solo victory if they are voted out during the Day
          (overrides other win conditions).
        </li>
      </ul>

      <h3>Night Order Reminder</h3>
      <p>Always follow this order:</p>
      <ul>
        <li>Everyone close eyes.</li>
        <li>Mafia wake, pick a victim, sleep.</li>
        <li>Doctor wakes, picks a save, sleeps.</li>
        <li>Detective wakes (if alive), investigates, sleeps.</li>
        <li>Lover wakes on Night 1 (if present), picks protection, sleeps.</li>
      </ul>
    </div>
  );
}

