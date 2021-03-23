import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Input, Label } from 'native-base';

export default class Login  extends Component {
	
	/* On the render()  method of your React Native component, create a Form with input fields for Username and Password. */

	this.state = {
		validating: false
	}

	render() {
		return (
			<Container>
				<Content>
					<Form>
						<Item floatingLabel>
							<Label>Email</Label>
							<Input onChangeText={(text) => this.setState({email:text})} />
						</Item>
						<Item floatingLabel last>
							<Label>Password</Label>
							<Input secureTextEntry onChangeText={(text) => this.setState({password:text})} />
						</Item>
						<Button block success style={{ marginTop: 50 }} onPress={() => {
							if( this.state.email && this.state.password ){
								this.validate();

							}
						}} >
							<Text>Authenticate</Text>
						</Button>
					</Form>
				</Content>
			</Container>
		)
	}
	
	
	/* So now that we have a token, we pass it back to our mobile app as a response. Our mobile app should then be able to receive and store the token (and any other data you want to include) into our mobile device storage via AsyncStorage , this way, every time the user opens your mobile app, our application will just check the storage if it has a currently logged-in user (Persistent Login). */

	validate(){
		this.setState({ validating: true });

		let formData = new FormData();
		formData.append('type', 'login');
		formData.append('email', this.state.email);
		formData.append('password', this.state.password);

		return fetch('http://panbroorganics.com/authentication.php', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				let data = responseJson.data;

				if (this.saveToStorage(data)){
					this.setState({
						validating: false
					});
					
					/* Redirect to accounts page */
					Actions.pageAccount();
				} else {
					console.log('Failed to store auth');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	/**
	 * Store auth credentials to device.
	 *
	 */
	async saveToStorage(userData){
		if (userData) {
			await AsyncStorage.setItem('user', JSON.stringify({
					isLoggedIn: true,
					authToken: userData.auth_token,
					id: userData.user_id,
					name: userData.user_login
				})
			);
			return true;
		}

		return false;
	}
}

/* Then we can provide a logout button which basically clears the storage and notifies the server to clear the token associated with the currently logged-in user.

Here is how you would implement the logout method: */

async logout(){
	await AsyncStorage.removeItem('user');
	
	// Add a method that will delete user_meta token of the user from the server. 
	// await deleteUserMetaToken(PARAM_USER_ID); 
	
	/* Redirect to the login page */
	Actions.pageLogin();
}
