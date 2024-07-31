import { useState } from 'react';
import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, TextInput } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function BooksPage() {
    const { data: order_coffee, error } = useSWR<Order[]>("/coffee/ordercoffee");
    const [quantities, setQuantities] = useState({
        capuchino: 0,
        latte: 0,
        americano: 0
    });

    // Prices for each coffee type
    const prices = {
        capuchino: 10,
        latte: 15,
        americano: 7
    };

    // Calculate total price for each coffee type
    const totalByCoffeeType = {
        capuchino: quantities.capuchino * prices.capuchino,
        latte: quantities.latte * prices.latte,
        americano: quantities.americano * prices.americano
    };

    // Calculate overall total price
    const overallTotalPrice = Object.values(totalByCoffeeType).reduce((total, price) => total + price, 0);

    // Handle quantity change
    const handleQuantityChange = (coffee: keyof typeof quantities, value: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [coffee]: value >= 0 ? value : 0
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        const orders = [
            { coffee_id: 1, quantity: quantities.capuchino, total: totalByCoffeeType.capuchino },
            { coffee_id: 2, quantity: quantities.latte, total: totalByCoffeeType.latte },
            { coffee_id: 3, quantity: quantities.americano, total: totalByCoffeeType.americano }
        ];

        try {
            const response = await fetch('https://api-two-silk.vercel.app/api/v1/coffee/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orders),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Order submitted:', result);
            alert('Order submitted successfully!');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again later.');
        }
    };

    return (
        <>
            <Layout>
                <section
                    className="h-[200px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                    style={{
                        backgroundImage: `url(${cafeBackgroundImage})`,
                    }}
                >
                    <h1 className="text-5xl mb-2">กาแฟ</h1>
                    <h2>รายการกาแฟทั้งหมด</h2>
                </section>

                <section className="container mx-auto py-8">
                    <div className="flex justify-between">
                        <h1>รายการกาแฟ</h1>
                    </div>

                    {!order_coffee && !error && <Loading />}
                    {error && (
                        <Alert
                            color="red"
                            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                            icon={<IconAlertTriangleFilled />}
                        >
                            {error.message}
                        </Alert>
                    )}

                    <div className="flex flex-col items-start mb-5">
                        <label>Capuchino $10</label>
                        <label>จำนวน</label>
                        <input
                            type="number"
                            placeholder="Enter a number"
                            value={quantities.capuchino}
                            onChange={(e) => handleQuantityChange('capuchino', +e.target.value)}
                            className="p-1 border border-gray-300 rounded"
                        />
                        <TextInput 
                            label="หมายเหตุ"
                            placeholder="kkkk"
                        />
                        <div>Total for Capuchino: ${totalByCoffeeType.capuchino}</div>
                    </div>
                    <div className="flex flex-col items-start mb-5">
                        <label>Latte $15</label>
                        <label>จำนวน</label>
                        <input
                            type="number"
                            placeholder="Enter a number"
                            value={quantities.latte}
                            onChange={(e) => handleQuantityChange('latte', +e.target.value)}
                            className="p-1 border border-gray-300 rounded"
                        />
                         <TextInput 
                            label="หมายเหตุ"
                            placeholder="kkkk"
                        />
                        <div>Total for Latte: ${totalByCoffeeType.latte}</div>
                    </div>
                    <div className="flex flex-col items-start mb-5">
                        <label>Americano $7</label>
                        <label>จำนวน</label>
                        <input
                            type="number"
                            placeholder="Enter a number"
                            value={quantities.americano}
                            onChange={(e) => handleQuantityChange('americano', +e.target.value)}
                            className="p-1 border border-gray-300 rounded"
                        />
                         <TextInput 
                            label="หมายเหตุ"
                            placeholder="kkkk"
                        />
                        <div>Total for Americano: ${totalByCoffeeType.americano}</div>
                    </div>

                    <div className="mt-5">
                        <h2 className="text-xl font-semibold">Overall Total Price: ${overallTotalPrice}</h2>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-5 p-2 bg-blue-500 text-white rounded"
                    >
                        Submit Order
                    </button>
                </section>
            </Layout>
        </>
    );
}
