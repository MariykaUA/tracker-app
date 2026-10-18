// One tile of a ChoiceTiles group (mood, anxiety, crying)
export interface ChoiceOption<T extends string = string> {
  value: T
  label: string
  color: string // tile fill
  ink: string // text colour on the fill
  edge: string // 3D bottom edge
}
