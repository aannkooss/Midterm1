import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
  Text,
  Card,
} from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import outputs from '../amplify_outputs.json' with { type: 'json' };

import type { Client } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

Amplify.configure(outputs);

const client: Client<Schema> = generateClient<Schema>();

type Todo = Schema['Todo']['type'];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // FIX #2: Fetch from the 'Todo' model
        const { data: items } = await client.models.Todo.list();
        setTodos(items);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <View as="main" padding="2rem">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Heading level={2}>
          Welcome,{' '}
          <Text as="span" color="font.tertiary">
            {user?.username}
          </Text>
        </Heading>
        <Button onClick={signOut} variation="primary" size="small">
          Sign Out
        </Button>
      </Flex>
      <Divider margin="medium" />

      <Heading level={3} marginBottom="medium">
        My Todos
      </Heading>
      <Grid templateColumns="1fr 1fr 1fr" gap="1rem">
        {todos.map((todo) => (
          <Card key={todo.id} variation="outlined">
            {}
            <Text>{todo.content}</Text>
          </Card>
        ))}
      </Grid>
    </View>
  );
}