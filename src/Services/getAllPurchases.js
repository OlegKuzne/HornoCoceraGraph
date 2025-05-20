const getAllPurchases = async () => {
  try {
    const response = await fetch('https://us-central1-hornococera.cloudfunctions.net/api/getAllPurchases', {
      method: 'GET',
      headers: {
        'x-api-key': 'SKZQylhBf9JRgwFFecYjPgZQ2QYqFRDX'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }

  } catch (error) {
    console.error("Error al cargar ventas:", error);
    throw error;
  }
};

export default getAllPurchases;