import { Component } from 'inferno';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import Footer from '@components/Footer';
import '@styles/LoMain.css'

export default class LoMain extends Component {
  state = {
    sidebar: false
  }

  toggleSidebar = () => this.setState({ sidebar: !this.state.sidebar })

  render() {
    return (
      <div class="container">
        <Header toggleSidebar={this.toggleSidebar} />

        <Sidebar {...this.props} sidebar={this.state.sidebar} toggleSidebar={this.toggleSidebar} />

        <div class="main">{this.props.children}</div>

        <Footer />
      </div>
    )
  }
}