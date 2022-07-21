import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { VStack, Text } from 'native-base';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const route = useRoute();
  const {orderId} = route.params as RouteParams;

  return (
    <VStack flex={1} bg="gray.700">
        <Header title="solicitação"/>
        <Text color="white">
          {orderId}
        </Text>
    </VStack>
  );
}