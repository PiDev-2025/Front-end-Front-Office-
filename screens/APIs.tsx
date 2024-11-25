// https://recoiljs.org/docs/guides/asynchronous-data-queries

import React, { useEffect, useState } from 'react';
import {SafeAreaView, Text, View, Button} from 'react-native';
import axios from 'axios';

function ApiElysia(): React.JSX.Element {

  const API_URL = process.env.API_URL;
  const [data, setData] = useState<{ s?: string; v?: string; err?: string } | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/status`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching status:', error);
        setData({err:'Error fetching status'});
      }
    };

    fetchStatus();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>
        {data && data.s === 'running' ? '🟢' : ''} API : {data ? data.s : 'Loading...'} :: {data ? data.v : 'Loading...'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

function APIMessaging(): React.JSX.Element {


return (
    <SafeAreaView>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messaging</Text>
    </View>
    </SafeAreaView>
  );
}
// Main screen
function APIsScreen(): React.JSX.Element {
  return (
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Connection Status</Text>
          <View style={{marginVertical: 10}}>
            <ApiElysia />
            <APIMessaging />
          </View>
        </View>
      </SafeAreaView>
  );
}

export default APIsScreen;
