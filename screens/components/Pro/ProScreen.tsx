import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DashboardMenu from './DashboardMenu';
import Dashboard from './Dashboard';

type ScreenType = 'menu' | 'dashboard';

export default function ProScreen() {
	const [currentScreen, setCurrentScreen] = useState<ScreenType>('menu');

	const handleNavigateToDashboard = () => {
		setCurrentScreen('dashboard');
	};

	const handleNavigateToMenu = () => {
		setCurrentScreen('menu');
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 'dashboard':
				return (
					<Dashboard
						onToggleStatus={(status) => {
							console.log('Status changed:', status ? 'Online' : 'Offline');
						}}
						onSchedulePress={() => {
							console.log('Schedule pressed');
						}}
						onReschedule={() => {
							console.log('Reschedule appointment');
						}}
						onCancel={() => {
							console.log('Cancel appointment');
						}}
						onChat={() => {
							console.log('Open chat');
						}}
					/>
				);
			case 'menu':
			default:
				return (
					<DashboardMenu
						onDashboardPress={handleNavigateToDashboard}
						onCalendarPress={() => {
							console.log('Calendar pressed');
						}}
						onPatientsPress={() => {
							console.log('Patients pressed');
						}}
						onSettingsPress={() => {
							console.log('Settings pressed');
						}}
						onNotificationsPress={() => {
							console.log('Notifications pressed');
						}}
					/>
				);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{renderScreen()}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#000000',
	},
});
