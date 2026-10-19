/** Test-only MF2 languages, independent of NARL's production message keys. */
export const TEST_MESSAGES = {
  en: {
    listOptions: "{$items :list style=$style type=$type}",
    list: "{$items :list style=long type=conjunction}",
    greeting: "Hello, {$name}!",
    items: `.input {$count :number}
.match $count
0 {{No items}}
one {{{$count} item}}
* {{{$count} items}}`,
    transfer: "{$source} gave {$count :number} {$item} to {$target}.",
    literals: "{$first}: {$second} (%)",
  },
  pl: {
    listOptions: "{$items :list style=$style type=$type}",
    list: "{$items :list style=long type=conjunction}",
    greeting: "Cześć, {$name}!",
    items: `.input {$count :number}
.match $count
0 {{Brak przedmiotów}}
one {{{$count} przedmiot}}
few {{{$count} przedmioty}}
* {{{$count} przedmiotów}}`,
    transfer: "{$source} przekazuje {$target}: {$count :number} {$item}.",
    literals: "{$first}: {$second} (%)",
  },
} as const
