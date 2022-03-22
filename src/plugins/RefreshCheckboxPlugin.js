import { BaseComponent, h } from "gridjs";

class RefreshCheckboxPlugin extends BaseComponent {
  constructor(...props) {
    super(...props);
  }

  checkboxUpdate(e) {
    this.props.setShouldUpdate(e.target.checked);
  }

  render() {
    return h(
      "p",
      {
        style: {
          margin: "12px",
          float: "left"
        },
      },
      [
        h(
          "input",
          {
            type: "checkbox",
            onChange: (e) => this.checkboxUpdate(e),
            checked: true,
            style: {
                margin: "5px"
            }
          },
          null
        ),
        "Aktualizuj listę",
      ]
    );
  }
}

export default RefreshCheckboxPlugin;
