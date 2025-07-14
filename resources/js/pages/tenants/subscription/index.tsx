export default function Index({ subscription, plans }) {
    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-2xl font-bold">Subscription Management</h1>
            <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Current Subscription</h2>
                {subscription ? (
                    <div className="rounded bg-white p-4 shadow">
                        <p>
                            <strong>Plan:</strong> {subscription.plan.name}
                        </p>
                        <p>
                            <strong>Status:</strong> {subscription.status}
                        </p>
                        <p>
                            <strong>Next Payment:</strong> {subscription.next_payment_date}
                        </p>
                    </div>
                ) : (
                    <p>No active subscription found.</p>
                )}
            </div>
            <div>
                <h2 className="mb-2 text-xl font-semibold">Available Plans</h2>
                <ul className="space-y-4">
                    {plans.map((plan) => (
                        <li key={plan.id} className="rounded bg-white p-4 shadow">
                            <h3 className="font-bold">{plan.name}</h3>
                            <p>{plan.description}</p>
                            <p>
                                <strong>Price:</strong> {plan.price} {plan.currency}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
