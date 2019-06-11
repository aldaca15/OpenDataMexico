/**
 * Sample OpenDataMexico React Native App: The idea of this app is to show how easily is to integrate the Mexico's Goverment Open Data platform into a an app
 * https://github.com/facebook/react-native
 * https://github.com/aldaca15/
 * @author Ali Adame
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Linking, Button } from 'react-native';
import Logo from './Logo.json';

const instructions = Platform.select({
  ios: 'Los siguientes son datos abiertos,\n' + 'disponibles en la plataforma de gob.MX para los ciudadanos.',
  android:
    'Los siguientes son datos abiertos,\n' +
    'disponibles en la plataforma de gob.MX para los ciudadanos.',
});

class FlatListDemo extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
		  loading: false,
		  data: [],
		  page: 1,
		  seed: 1,
		  error: null,
		  refreshing: false,
		}
	}
	
	componentDidMount() {
		this.makeRemoteRequest()
	}
	
	makeRemoteRequest = () => {
		const { page, seed } = this.state;
		const url = 'https://api.datos.gob.mx/v1/gobmx.facts';
		this.setState({ loading: true });
		fetch(url)
		  .then(res => res.json())
		  .then(res => {
			this.setState({
			  data: page === 1 ? res.results : [...this.state.data, ...res.results],
			  error: res.error || null,
			  loading: false,
			  refreshing: false
			});
		  })
		.catch(error => {
			this.setState({ error, loading: false });
		});
	}
	
	renderItem(data) {
        return 
		<View style={{ flex: 1, flexDirection: 'row' }}>
			<Image source={{uri: Logo.file}} 
                style={{ width: 50, height:50 }}
				/>
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<Text style={styles.itemHeader}>{data.item.organization}</Text>
				<Text style={styles.itemDescription}>{data.item.fact}</Text>
			</View>
			<View style={{ flexDirection: 'column' }}>
				<Button title="Consultar" onPress={ ()=>{ Linking.openURL(data.item.url)}} />
			</View>
        </View>
    }
	
	render() {
		const { pokeList, loading } = this.state;
		if(!loading) {
			return (
				<FlatList
					data={this.state.data}
					renderItem={ this.renderItem }
					keyExtractor={(item) => item._id}
				/>
			);
		} else {
            return <ActivityIndicator />
        }
	}
	
}

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>Datos abiertos, Gob.MX</Text>
        <Text style={styles.instructions}>App no oficial</Text>
        <Text style={styles.instructions}>{instructions}</Text>
		<FlatListDemo/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  itemHeader: {  
    color: '#000',
    fontSize: 18,
  },
  itemDescription: {  
    color: '#777',
    fontSize: 14,
  },
});
