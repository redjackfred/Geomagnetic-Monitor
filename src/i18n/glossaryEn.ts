import type { Glossary } from './glossaryTypes'

export const glossaryEn: Glossary = {
  kp: {
    desc: 'The main number on the gauge — Kp from 0 (calm) to 9 (extreme storm). It shows how disturbed Earth\'s magnetic field is right now, based on readings from observatories worldwide.',
    impacts:
      'Kp 5+ means a geomagnetic storm. Higher numbers bring stronger effects: aurora farther south, GPS glitches, radio static, and power-grid alerts.',
    human: {
      physical:
        'Magnetic-field swings do not directly harm people on the ground. Radiation concern mainly applies to astronauts and high-altitude or polar flights — not everyday life at sea level.',
      mental:
        'Some studies and personal reports link stronger Kp to sleep changes, fatigue, or mood shifts, but evidence is limited and not conclusive.',
    },
  },
  kp1m: {
    desc: 'The “live geomagnetic level” stat — a Kp estimate updated every minute. It is the fastest way to see if conditions are changing, before the official 3-hour value is finalized.',
    impacts:
      'Watch for sudden jumps: they often mean a storm is building, aurora may appear soon, or GPS and radio quality may drop within the hour.',
  },
  kp3h: {
    desc: 'The “official 3-hour value” — NOAA\'s standard Kp for each 3-hour block. This is the number used to set G1–G5 storm levels and what utilities and airlines track.',
    impacts:
      'When this reaches 5+, a storm is officially underway. Grid operators and satellite teams use it for real operational decisions.',
  },
  gScale: {
    desc: 'The “storm severity scale” bar — NOAA ranks storms G1 (minor) through G5 (extreme) from Kp: G1 at 5+, G2 at 6+, G3 at 7+, G4 at 8+, G5 at 9. G0 means all quiet.',
    impacts:
      'G1: small grid wobbles, aurora in Canada/Scandinavia. G3: voltage fixes needed, aurora near ~50°N. G5: serious grid risk, aurora unusually far south (~40°N).',
    human: {
      physical:
        'G1–G2: negligible change for people on the ground. G3+: airlines may limit polar exposure. G4–G5: real radiation risk for astronauts and frequent polar flyers only.',
      mental:
        'Higher G levels correlate with more reported sleep trouble and stress — partly from disrupted tech/services, partly from anecdotal “storm sensitivity.”',
    },
  },
  aIndex: {
    desc: 'The “activity score today” under the 3-hour value — a running total of how active Earth\'s magnetic field has been since midnight (0 = quiet, higher = more disturbed).',
    impacts:
      'A high score means sustained disturbance, not just a brief spike. Long busy days can add up for pipelines, power systems, and satellites.',
  },
  f107: {
    desc: 'The “sun activity level” — how bright the Sun is at radio wavelengths (F10.7 flux). It reflects overall solar activity, similar to counting sunspots.',
    impacts:
      'A more active Sun can mean more flares and storms in the days ahead. It also changes how radio signals bounce and adds drag on low satellites.',
  },
  sfu: {
    desc: 'Solar flux units — the scale for “sun radio brightness.” Typical quiet Sun is ~70; active periods can exceed 300. Higher = a busier Sun.',
    impacts:
      'Rising values often precede more flares and coronal mass ejections, which can trigger geomagnetic storms 1–3 days later.',
  },
  flareM: {
    desc: 'Chance of medium (M-class) solar flares today — moderate eruptions on the Sun that can briefly disrupt radio on Earth\'s day side.',
    impacts:
      'M-flares may cause short-wave blackouts on the sunlit hemisphere, extra radiation for high-altitude flights, and sometimes a storm if a CME is aimed at Earth.',
  },
  flareX: {
    desc: 'Chance of strong (X-class) solar flares today — the most powerful type, at least 10× stronger than M-class.',
    impacts:
      'X-flares can black out HF radio worldwide on the day side, upset satellites, and — if Earth-directed — drive severe storms 1–3 days later.',
  },
  proton: {
    desc: 'Chance of a radiation storm today — high-energy protons from the Sun reaching Earth after a major eruption.',
    impacts:
      'Raises radiation exposure for astronauts and polar flights, can damage satellite electronics, degrade HF radio, and trigger polar cap absorption.',
    human: {
      physical:
        'The clearest human health impact: increased radiation dose for astronauts, airline crews, and passengers on polar or very high routes. Ground-level exposure stays low thanks to the atmosphere.',
      mental:
        'Awareness of a radiation storm may cause worry, especially for frequent flyers — operational reroutes usually limit actual exposure.',
    },
  },
  pca: {
    desc: 'Polar radio interference (polar cap absorption) — energetic particles thicken the ionosphere over the poles and absorb HF signals. Shown as green / yellow / red.',
    impacts:
      'During strong events, HF communications above ~60° latitude may be degraded or blocked for hours — affecting polar aviation and emergency links.',
  },
  aurora: {
    desc: '“Where aurora may show” — the Northern or Southern Lights, caused when solar particles hit the upper atmosphere. Stronger geomagnetic activity pushes the aurora farther from the poles.',
    impacts:
      'Seeing aurora usually means elevated Kp nearby. You may also notice GPS drift, radio noise, or grid alerts at similar latitudes.',
  },
  auroraLat: {
    desc: '“North of ~X°” — a rough latitude line for where aurora might appear on a dark, clear night at the current Kp. The oval sits poleward of this line.',
    impacts:
      'If you are north of this line at night during active conditions, look up. HF radio and GPS may be noisier in the same region.',
  },
  forecastKp: {
    desc: 'The “forecast peak” stat — the highest Kp NOAA expects in the upcoming period, from solar-wind models and tracking of eruptions heading toward Earth.',
    impacts:
      'Helps you plan ahead: possible aurora, GPS issues, grid alerts, or polar flight reroutes depending on how high the peak is.',
  },
  estimated: {
    desc: 'Solid bars on the forecast chart — interim Kp from live magnetometer data before a 3-hour period closes and the value is finalized.',
    impacts:
      'Early warning of rising activity. Estimated Kp climbing toward 5+ often means a storm watch is coming.',
  },
  predicted: {
    desc: 'Dashed bars on the forecast chart — NOAA\'s official forward look at Kp, using solar-wind data from the L1 point (e.g. DSCOVR) and CME models.',
    impacts:
      'Predicted Kp 5+ means prepare for storm effects in hours to days: aurora, navigation errors, and power alerts by G level.',
  },
  swpc: {
    desc: 'NOAA Space Weather Prediction Center (SWPC) — the official U.S. source for space-weather forecasts, watches, warnings, and the data shown on this dashboard.',
    impacts:
      'SWPC bulletins drive decisions for power grids, aviation, satellites, and emergency planning worldwide during space-weather events.',
  },
  alerts: {
    desc: '“Official NOAA notices” — bulletins when thresholds are crossed: Alerts (happening now), Watches (likely within 48 h), Warnings (major event imminent or underway).',
    impacts:
      'Geomagnetic notices mean storms may affect grids, GPS, HF radio, satellites, and aurora. Other types cover flares, radiation, and radio bursts.',
  },
  impacts: {
    desc: '“What to expect now” — a plain-language list of effects for the current storm level, based on NOAA experience and past events.',
    impacts:
      'Effects grow with G level: from minor satellite drag at G1 to widespread grid stress, navigation trouble, and radio blackouts at G4–G5.',
    human: {
      physical:
        'See the “Effects on people” section below: ground-level safety is generally unchanged; radiation matters most for aviation and space.',
      mental:
        'Sleep, mood, and stress responses vary by person and storm strength — reported more often during G3+ events.',
    },
  },
  stormPeak: {
    desc: '“Strongest storm expected each day” — the highest G level NOAA forecasts for each calendar day from that day\'s 3-hour Kp predictions.',
    impacts:
      'Days forecast at G3+ deserve extra attention: possible impacts on power systems, polar routes, and satellite operations.',
  },
  solarPanel: {
    desc: '“Sun activity & 3-day forecast” — today\'s solar brightness, flare and radiation odds, plus a day-by-day geomagnetic outlook.',
    impacts:
      'A busy Sun today often means stormier geomagnetic conditions 1–3 days out. High flare chances are worth watching.',
  },
  geomagneticTag: {
    desc: 'This notice is about geomagnetic activity — disturbances in Earth\'s magnetic field from solar wind or coronal mass ejections, measured by Kp.',
    impacts:
      'Geomagnetic bulletins point directly to possible grid, GPS, HF radio, satellite, and aurora effects.',
  },
}
