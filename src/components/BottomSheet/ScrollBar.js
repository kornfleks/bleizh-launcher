import React, { PureComponent, createRef } from 'react'
import {
  View,
  Animated,
  TextInput,
  StyleSheet
} from 'react-native'
import { Svg, Defs, Use, G, Circle, Rect } from 'react-native-svg'


class ScrollBar extends PureComponent {

  progressLetterText = createRef()
  progressLetter = createRef()
  animation = new Animated.Value(0)

  state = {
    contentHeight: 0,
    isVisible: true
  }

  setProperties = ({ contentHeight, isVisible }) => this.setState({ contentHeight, isVisible })

  setProgressLetter = (letter) => {
    if (!this.progressLetterText.current) return;
    this.progressLetterText.current.setNativeProps({ text: letter })
  }

  hideProgressLetter = () => {
    if (!this.progressLetter.current) return;
    this.progressLetter.current.getNode().setNativeProps({
      style: {
        height: 0,
        overflow: 'hidden'
      }
    })
  }

  showProgressLetter = () => {
    if (!this.progressLetter.current) return;
    this.progressLetter.current.getNode().setNativeProps({
      style: {
        height: 'auto',
        overflow: 'visible'
      }
    })
  }

  _getScrollbarTranslateY = (deltaY = 0) => {
    const { height, indicatorHeight } = this.props
    const { contentHeight } = this.state
    if (!contentHeight) {
      return 0
    }
    return this.animation.interpolate({
      inputRange: [0, Math.max(contentHeight - height, 0)],
      outputRange: [deltaY, height - indicatorHeight + deltaY],
      extrapolate: 'clamp'
    })
  }

  render() {
    const {
      isVisible
    } = this.state
    const {
      width,
      height,
      indicatorWidth,
      indicatorHeight,
      progressLetterSize
    } = this.props

    return (
      <View
        style={[
          styles.container,
          {
            width,
            height,
            opacity: isVisible ? 1 : 0
          }
        ]}
      >
        <View
          style={[
            styles.background,
            {
              width: (2 / 3) * width,
              height,
            }
          ]}
        />
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{
                translateY: this._getScrollbarTranslateY()
              }],
              height: indicatorHeight,
              width: indicatorWidth,
            }
          ]}
        />
        <Animated.View
          ref={this.progressLetter}
          style={[
            styles.progressLetter,
            {
              transform: [
                {
                  translateX: -(4 / 5) * progressLetterSize
                }, {
                  translateY: this._getScrollbarTranslateY(-(2 / 3) * progressLetterSize)
                }
              ]
            }
          ]}
        >
          <Svg
            style={[
              styles.progressLetterTail,
              {
                width: progressLetterSize,
                height: progressLetterSize
              }
            ]}
            height={progressLetterSize}
            width={progressLetterSize}
            viewBox="0 0 300 100"
          >
            <Defs>
              <G id="shape">
                <G>
                  <Circle cx="50" cy="50" r="100" fill="#009688" />
                  <Rect x="50" y="50" width="100" height="100" fill="#009688" />
                </G>
              </G>
            </Defs>
            <Use href="#shape" x="50" y="0" />
          </Svg>
          <View
            style={[
              styles.progressLetterBody,
              {
                width: (2 / 3) * progressLetterSize,
                height: progressLetterSize
              }
            ]}
          >
            <TextInput
              style={styles.progressLetterText}
              editable={false}
              ref={this.progressLetterText}
            />
          </View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  background: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  indicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#009688',
    borderRadius: 4
  },
  progressLetter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 0,
    overflow: 'hidden'
  },
  progressLetterBody: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  progressLetterText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  progressLetterTail: {
    position: 'absolute',
    left: 0,
    top: 0
  }
})


export default ScrollBar
