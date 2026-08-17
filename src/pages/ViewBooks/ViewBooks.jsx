import { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
// import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Card, EmptyState, Th, Td, Stamp, inputCls, Pagination, CoverThumb } from "../../components/ui/UI.jsx";
import axios from "axios";

const PAGE_SIZE = 10;

export default function ViewBooks() {
  // const { book, deleteBook } = useLibrary();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);

  useEffect(()=>{
    const fatchBooks = async()=>{
      try{
        const response = await axios.get("https://library-system-3x9t.onrender.com/book/");
        setBooks(response.data)
      }catch(error){
        console.error("Error fetching books:", error);
      }
    };
    fatchBooks();
  },[])

  const filtered = books.filter((b) =>
    [b.book_name, b.author?.name, b.category?.name].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };


  const handleDelete = async (b) => {
    if (
      window.confirm(
        `Delete "${b.book_name}" from the catalogue? This cannot be undone.`
      )
    ) {
      await axios.delete(
        `https://library-system-3x9t.onrender.com/book/${b.book_number}/`
      );
  
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.book_number !== b.book_number)
      );
  
      if (paged.length === 1 && page > 1) {
        setPage(page - 1);
      }
    }
  };

  return (
    <section>
      <SectionHeader eyebrow="Catalogue · 02" title="View Books" subtitle={`${books.length} title(s) in the catalogue.`} />
      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input className={`${inputCls} pl-9`} placeholder="Search by title, author or category" value={search} onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <Card className="overflow-x-auto">
        {paged.length === 0 ? (
          <EmptyState text="No books found." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>Cover</Th>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((b) => (
                <tr key={b.book_number} className="hover:bg-gold/[0.04]">
                  <Td><CoverThumb src={b.image} alt={b.book_name} /></Td>
                  <Td><span className="font-medium text-ink">{b.book_name}</span></Td>
                  <Td>{b.author?.name}</Td>
                  <Td>{b.category?.name}</Td>
                  <Td>{b.book_price}</Td>
                  <Td mono>{b.book_quantity}</Td>
                  <Td><Stamp status={b.book_quantity > 0 ? "Available" : "Unavailable"} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-book/${b.book_number}`}
                        className="p-1.5 rounded-md border border-ink/12 text-ink/50 hover:text-gold hover:border-gold/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
                        aria-label="Edit book"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(b)}
                        className="p-1.5 rounded-md border border-ink/12 text-ink/50 hover:text-rust hover:border-rust/40 transition-colors focus:outline-none focus:ring-2 focus:ring-rust/30"
                        aria-label="Delete book">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </section>
  );
}
