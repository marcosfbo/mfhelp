import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDataFormat';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native';

import { Button} from '../components/Button';
import { Input } from '../components/Input';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';

import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import React from 'react';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navegation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();
  const {orderId} = route.params as RouteParams;

  function handleOrderClose(){
    if(!solution){
      return Alert.alert('Encerramento', 'Informe a solução para encerrar o chamado')
    }

    firestore()
    .collection<OrderFirestoreDTO>(order)
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Encerramento', 'Chamado encerrado com sucesso!');
      navegation.goBack();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Encerramento', 'Não foi possivel encerrar o chamado.')
    });
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { patrimony, description, status, created_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    });
  }, []);

  if(isLoading) {
    return(<Loading />);
  }

  return (
    <VStack flex={1} bg="gray.700">
        <Header title="solicitação"/>

        <HStack bg="gray.500" justifyContent="center" p={4}>
          {
            order.status === 'closed'
              ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
          }

          <Text 
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          
          </Text>
        </HStack>

        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails
            title="equipamento"
            description={`Patrimônio ${order.patrimony}`}
            icon={DesktopTower}
            footer={order.when}
          />
          <CardDetails
            title="descrição do problema"
            description={order.description}
            icon={Clipboard}
          />
          <CardDetails
            title="solução"
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' &&
              <Input
                placeholder="Descrição da solução"
                onChangeText={setSolution}
                h={24}
                textAlignVertical="top"
                multiline
              />
            }
            
          </CardDetails>
        </ScrollView>

        {
          order.status === 'open' &&
            <Button 
              title="Encerrar chamado"
              margin={5}
              onPress={handleOrderClose}
            />
        }
    </VStack>
  );
}