
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Image, Easing } from 'react-native';
import { Magnetometer,Accelerometer } from 'expo';


export default class MyClass extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        MagnetometerData: {}
      };
  };

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Magnetometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Magnetometer.addListener((result) => {
      this.setState({MagnetometerData: result});
    });

    Magnetometer.setUpdateInterval(2000);
  }
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

    render(){
    let { x, y, z } = this.state.MagnetometerData;
        return (
        <HomeScreen 
        Mgx={x}
        Mgy={y}
        Mgz={z}/>
        );
    };
};


class HomeScreen extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        accelerometerData: {}
      };
  };

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    //mesured value of accelermeter
    let { x, y, z } = this.state.accelerometerData;
    //mesured value of magnetometer
    let Mgx = round(this.props.Mgx);
    let Mgy = round(this.props.Mgy);
    let Mgz = round(this.props.Mgz);
    //modified value of magnetometer
    let Mgx1,Mgy1;
    //angle(degree) from equator for modified value (considering tilt of the device)
    let heading;
    //angle(degree) from equator for measured value (without considering tilt of the device)
    let heading2axis;
    //angle(degree) from north for modified value (considering tilt of the device)
    let Azimuth;
    //angle(degree) from north for measured value (without considering tilt of the device)
    let Azimuth2axis;

    //angle for roll(x-axis),pitch(y-axis),yaw(z-axis) with an unit of radian
    let phi,theta,psi;//phi x,theta y,psi z
    phi=round(Math.atan(round(y)/round(z)));
    theta=round(Math.atan(-x/Math.sqrt(Math.pow(round(y),2)+Math.pow(round(z),2))));
    psi= round(Math.atan((Mgz*Math.sin(phi)-Mgy*Math.cos(phi))/(Mgx*Math.cos(theta)+Mgy*Math.sin(theta)*Math.sin(phi)+Mgz*Math.sin(theta)*Math.cos(phi))));

    //Mg#1 is the modified value by acceleometer
    Mgx1=round(Math.cos(psi)*Math.cos(theta)*Mgx+(0-Math.sin(psi)*Math.cos(phi)+Math.cos(psi)*Math.sin(theta)*Math.sin(phi))*Mgy+(Math.sin(psi)*Math.sin(phi)+Math.cos(psi)*Math.sin(theta)*Math.cos(phi))*Mgz);

    Mgy1=round(Math.sin(psi)*Math.cos(theta)*Mgx+(Math.cos(psi)*Math.cos(phi)+Math.sin(psi)*Math.sin(theta)*Math.sin(phi))*Mgy+(0-Math.cos(psi)*Math.sin(phi)+Math.sin(psi)*Math.sin(theta)*Math.cos(phi))*Mgz);

    //Azimuth = 90° - θ
    heading=Math.atan(Mgy1/Mgx1);
    Azimuth=round(90-(heading*180/Math.PI)).toString()+' deg';
    //Azimuth2axis = 90° - θ
    heading2axis=Math.atan(Mgy/Mgx);
    //    Azimuth2axis=round(90-(heading2axis*180/Math.PI)).toString()+' deg';
    if(Mgx>0){
        Azimuth2axis=round(90-(heading2axis*180/Math.PI)).toString()+' deg';
    }else{
        Azimuth2axis=round(-90-(heading2axis*180/Math.PI)).toString()+' deg';
    };

    return (

      <View style={styles.sensor}>


      <View style={styles.container}>
       
       <Animated.Image
        style={{
          width: 125,
          height: 115,
          transform: [{rotate: Azimuth}] }}
          source={require('../assets/images/compass.jpeg')} />
       <Animated.Image
        style={{
          width: 125,
          height: 115,
          transform: [{rotate: Azimuth2axis}] }}
          source={require('../assets/images/compass.jpeg')} />
 
      </View>

        <Text>{"\n\n\n\n\n\n\n\n\n\n\n"}{Azimuth2axis}</Text>
        <Text>Ax: {round(x)} Ay: {round(y)} Az: {round(z)}</Text>
        <Text>Mx: {round(Mgx)} My: {round(Mgy)} Mz: {round(Mgz)}</Text>
        <Text>phi: {round(phi*180/Math.PI)} theta: {round(theta*180/Math.PI)} psi: {round(psi*180/Math.PI)}</Text>
        <Text>Mgx: {round(Mgx)}  Mgy: {round(Mgy)} Mgz: {round(Mgz)}</Text>
        <Text>heading: {round(heading*180/Math.PI)}</Text>

      </View>
    );
  }
}


function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});

