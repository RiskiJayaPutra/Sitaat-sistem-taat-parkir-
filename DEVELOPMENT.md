# Development Guide

## Setup Development Environment

### 1. Clone Repository

```bash
git clone https://github.com/RiskiJayaPutra/Sistem-taat-parkir-menggunakan-laravel-tailwind-dan-react.git
cd Sistem-taat-parkir-menggunakan-laravel-tailwind-dan-react
```

### 2. Backend Setup (Laravel)

```bash
cd sistem-parkir-api

# Install dependencies
composer install

# Copy .env
cp .env.example .env

# Generate key
php artisan key:generate

# Setup database di .env
# DB_DATABASE=sistem_parkir
# DB_USERNAME=root
# DB_PASSWORD=

# Migrate database
php artisan migrate

# Link storage
php artisan storage:link

# Run server
php artisan serve
```

### 3. Frontend Setup (React)

```bash
cd sistem-parkir-ui

# Install dependencies
npm install

# Copy .env
cp .env.example .env

# Run dev server
npm run dev
```

## Database Seeding

### Manual Seed

1. **Buat Admin**

```sql
INSERT INTO users (username, nama, password, role, created_at, updated_at)
VALUES ('admin', 'Administrator', '$2y$12$hash_password_disini', 'Admin', NOW(), NOW());
```

2. **Buat Satpam**

```sql
INSERT INTO users (username, nama, password, role, created_at, updated_at)
VALUES ('satpam1', 'Satpam Satu', '$2y$12$hash_password_disini', 'Satpam', NOW(), NOW());
```

3. **Atau gunakan seeder**

```bash
php artisan db:seed
```

## API Testing

### Using Postman/Insomnia

1. **Login**

```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "message": "Login berhasil",
  "user": {...},
  "token": "1|xyz..."
}
```

2. **Get Current User**

```http
GET http://localhost:8000/api/me
Authorization: Bearer {token}
```

3. **Create Mahasiswa**

```http
POST http://localhost:8000/api/mahasiswa
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "npm": "2024001",
  "nama": "John Doe",
  "prodi_id": 1,
  "foto_ktm": [file],
  "foto_mahasiswa": [file],
  "plat_nomor": "BE 1234 AA",
  "foto_stnk": [file],
  "password": "password123"
}
```

## Git Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Make changes
git add .
git commit -m "feat: deskripsi fitur"

# Push to remote
git push origin feature/nama-fitur

# Create Pull Request di GitHub
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add multiple photo upload for reports"
git commit -m "fix: resolve ban status display issue"
git commit -m "docs: update API documentation"
```

## Code Style

### Backend (PHP/Laravel)

- Follow PSR-12 coding standard
- Use meaningful variable names
- Add type hints for parameters and return types
- Use Eloquent ORM for database queries
- Validate all input data

```php
public function store(Request $request): JsonResponse
{
    $validatedData = $request->validate([
        'nama' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
    ]);

    $user = User::create($validatedData);

    return response()->json($user, 201);
}
```

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Extract reusable logic into custom hooks
- Use TailwindCSS utility classes

```jsx
export default function UserCard({ user }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axiosClient.delete(`/users/${user.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="text-lg font-bold">{user.nama}</h3>
      <button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
```

## Debugging

### Laravel Debug Mode

1. Enable debug in `.env`:

```
APP_DEBUG=true
LOG_LEVEL=debug
```

2. Check logs:

```bash
tail -f storage/logs/laravel.log
```

### React Dev Tools

1. Install React Developer Tools extension
2. Open browser DevTools
3. Check Components and Profiler tabs

### Database Queries

Enable query logging in Laravel:

```php
// routes/api.php or any controller
use Illuminate\Support\Facades\DB;

DB::enableQueryLog();
// Your code here
dd(DB::getQueryLog());
```

## Common Issues

### Issue: 419 CSRF Token Mismatch

**Solution**: Pastikan Sanctum configured dengan benar di `config/sanctum.php`

### Issue: CORS Error

**Solution**: Add domain to `SANCTUM_STATEFUL_DOMAINS` in `.env`

### Issue: File Upload Failed

**Solution**:

```bash
php artisan storage:link
# Check storage folder permissions
chmod -R 775 storage
```

### Issue: Migration Error

**Solution**:

```bash
php artisan migrate:fresh --seed
# atau
php artisan migrate:rollback
php artisan migrate
```

## Testing

### Backend Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=UserTest

# Generate coverage report
php artisan test --coverage
```

### Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## Performance Optimization

### Backend

1. **Enable Caching**

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. **Use Eager Loading**

```php
$mahasiswa = Mahasiswa::with(['prodi', 'kendaraan'])->get();
```

3. **Add Database Indexes**

```php
Schema::table('mahasiswa', function (Blueprint $table) {
    $table->index('npm');
    $table->index('prodi_id');
});
```

### Frontend

1. **Code Splitting**

```jsx
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
```

2. **Optimize Images**

- Use WebP format
- Compress images before upload
- Use lazy loading for images

3. **Bundle Analysis**

```bash
npm run build
npm install -g source-map-explorer
source-map-explorer 'dist/assets/*.js'
```

## Useful Commands

### Laravel Artisan

```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate files
php artisan make:controller UserController
php artisan make:model User -m
php artisan make:migration create_users_table

# Database
php artisan migrate:fresh --seed
php artisan db:seed --class=UserSeeder

# Queue
php artisan queue:work
php artisan queue:listen
```

### NPM Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com)
- [Framer Motion](https://www.framer.com/motion)
