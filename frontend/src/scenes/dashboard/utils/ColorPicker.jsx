import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import { Box, Typography, Grid } from "@mui/material";

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.defaultColor || "#ff0000",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultColor !== prevProps.defaultColor) {
      this.setState({ color: this.props.defaultColor });
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex });
    if (this.props.onColorChange) {
      this.props.onColorChange(this.props.id, color.hex);
    }
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "32px",
          height: "32px",
          borderRadius: "2px",
          background: this.state.color,
        },
        swatch: {
          padding: "1px",
          background: "#888",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    const { displayColorPicker, color } = this.state;

    return (
      <Box display="flex">
        <Box width="32px" ml="25px" textAlign="Left">
          <Typography variant="h4">
            {this.props.id.charAt(0).toUpperCase() + this.props.id.slice(1)}
          </Typography>
        </Box>
        <Box xs={1}>
          <Box style={styles.swatch} ml="110px" onClick={this.handleClick}>
            <Box style={styles.color}>
              {displayColorPicker ? (
                <Box style={{ position: "absolute", zIndex: "2" }}>
                  <Box
                    style={{
                      position: "fixed",
                      top: "0px",
                      right: "0px",
                      bottom: "0px",
                      left: "0px",
                    }}
                    onClick={this.handleClose}
                  />
                  <SketchPicker color={color} onChange={this.handleChange} />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default ColorPicker;
