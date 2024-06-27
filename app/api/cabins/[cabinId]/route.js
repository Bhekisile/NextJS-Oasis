export async function GET(request, { params }) {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([getCabin(cabinId)])
    return Response.json({test: "test"});
  }
  catch {
    return Response.json({message: "Cabin not found"});
  }

}

// export async function POST() {}