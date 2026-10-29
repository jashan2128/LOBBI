'use client'

import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; onError: () => void }
type State = { failed: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
