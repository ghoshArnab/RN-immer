import React from 'react';
import { StyleSheet, Text, ScrollView, View, Platform } from 'react-native';
import produce from "immer";

export default function App() {


  /* get Trap */
  let products = new Proxy([
    { name: 'Firefox', type: 'browser' },
    { name: 'SeaMonkey', type: 'browser' },
    { name: 'Thunderbird', type: 'mailer' }
  ],
    {
      get: function (obj, prop) {
        // The default behavior to return the value; prop is usually an integer
        if (prop in obj) {
          return obj[prop];
        }

        // Get the number of products; an alias of products.length
        if (prop === 'number') {
          return obj.length;
        }

        let result, types = {};

        for (let product of obj) {
          if (product.name === prop) {
            result = product;
          }
          if (types[product.type]) {
            types[product.type].push(product);
          } else {
            types[product.type] = [product];
          }
        }

        // Get a product by name
        if (result) {
          return result;
        }

        // Get products by type
        if (prop in types) {
          return types[prop];
        }

        // Get product types
        if (prop === 'types') {
          return Object.keys(types);
        }

        return undefined;
      }
    });

  /* Get Trap */

  let numbers = [];

  numbers = new Proxy(numbers, { // (*)
    set(target, prop, val) { // to intercept property writing
      if (typeof val == 'number') {
        target[prop] = val;
        return true;
      } else {
        return false;
      }
    }
  });

  numbers.push(1); // added successfully
  numbers.push(2); // added successfully

  /* Get Trap */


  /* Has Trap */

  let range = {
    start: 1,
    end: 10
  };

  range = new Proxy(range, {
    has(target, prop) {
      return prop >= target.start && prop <= target.end
    }
  });

  /* Has Trap */

  /* immer support */

  const todos = [{ a: 2 }, { b: 3 }];

  const nextTodos = produce(todos, draft => {
    draft.push({ text: "learn immer", done: true });
    draft[1].done = true;
  });

  /* immer support */

  return (
    <View style={styles.container}>
    <ScrollView>
      <Text style={styles.hrline}>
        Product --> {JSON.stringify(Platform, null, 2)}
      </Text>


      <Text style={styles.hrline}>
        Proxy Get Trap -->
        {JSON.stringify(products, null, 2)}



      </Text>

      <Text style={styles.hrline}>
        Proxy Set Trap -->
        {JSON.stringify(numbers, null, 2)}



      </Text>

      <Text style={styles.hrline}>
        Proxy Has Trap -->
        {JSON.stringify(50 in range, null, 2)};
        {JSON.stringify(5 in range, null, 2)};




      </Text>


      <Text style={styles.hrline}>
        Immer support -->
        Todos --> {JSON.stringify(todos, null, 2)};
        NextTodos --> {JSON.stringify(nextTodos, null, 2)};
        Are both same ? --> {JSON.stringify((todos === nextTodos), null, 2)};




      </Text>



    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    marginTop: 50,
    marginLeft: 20
  },
  hrline: {
    borderBottomColor: 'black',
    paddingBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1
  }
});
