import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import getAllPurchases from '../Services/getAllPurchases';
import styles from '../Styles/DashboardStyles';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const [dataMensual, setDataMensual] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const compras = await getAllPurchases();

        const meses = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          meses[key] = {
            total: 0,
            label: `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`
          };
        }

        compras.forEach((compra) => {
          if (!compra.createdAt) return;

          const fecha = new Date(compra.createdAt);
          const fechaKeyMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

          if (meses.hasOwnProperty(fechaKeyMes)) {
            compra.items.forEach((item) => {
              meses[fechaKeyMes].total += parseFloat(item.totalPrice || 0);
            });
          }
        });


        const dataMensualFormateada = Object.values(meses);

        setDataMensual(dataMensualFormateada);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando ventas:', error);
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  const chartDataMensual = {
    labels: dataMensual.map((d) => d.label),
    datasets: [
      {
        data: dataMensual.map((d) => d.total),
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ventas de los últimos 6 meses (€)</Text>
      {dataMensual.length > 0 && (
        <BarChart
          data={chartDataMensual}
          width={screenWidth - 40}
          height={260}
          yAxisLabel="€"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#6a89cc',
            backgroundGradientTo: '#4a69bd',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
          fromZero
        />
      )}
    </ScrollView>
  );
}