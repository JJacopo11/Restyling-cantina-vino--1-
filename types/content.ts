export interface Wine {
  type: string
  tone: string
  name: string
  grape: string
  image: string
  note: string
}

export interface Vintage {
  year: number
  character: string
  note: string
  detail: string
}

export interface Decade {
  key: string
  label: string
  lo: number
  hi: number
}

export interface Experience {
  key: 'classica' | 'verticale' | 'sumisura'
  name: string
  meta: string
  price: string
  description: string
}
