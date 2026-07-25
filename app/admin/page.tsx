export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          <div>
            <h1 className="text-4xl font-black">
              ZeroArc Admin
            </h1>

            <p className="mt-2 text-zinc-400">
              Welcome back, Admin 👋
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            <p className="text-sm text-zinc-400">
              Role
            </p>

            <p className="font-semibold">
              SUPER_ADMIN
            </p>
          </div>

        </div>
      </div>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-8 py-10">

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-400">
              Products
            </p>

            <h2 className="mt-4 text-4xl font-black">
              0
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-400">
              Orders
            </p>

            <h2 className="mt-4 text-4xl font-black">
              0
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-400">
              Revenue
            </p>

            <h2 className="mt-4 text-4xl font-black">
              ₹0
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-400">
              Pending Orders
            </p>

            <h2 className="mt-4 text-4xl font-black">
              0
            </h2>
          </div>

        </div>

        {/* Recent Orders */}
        <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-zinc-800 text-left text-zinc-400">

                  <th className="pb-4">
                    Order ID
                  </th>

                  <th className="pb-4">
                    Customer
                  </th>

                  <th className="pb-4">
                    Total
                  </th>

                  <th className="pb-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-zinc-500"
                  >
                    No Orders Yet
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* Recent Products */}
        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

          <h2 className="text-2xl font-bold">
            Recent Products
          </h2>

          <div className="py-12 text-center text-zinc-500">
            No Products Yet
          </div>

        </div>

      </div>

    </main>
  );
}