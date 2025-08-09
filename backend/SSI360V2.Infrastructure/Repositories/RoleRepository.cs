using Microsoft.EntityFrameworkCore;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Infrastructure.Repositories;

public class RoleRepository : Repository<Role>, IRoleRepository
{
    public RoleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Role>> GetByTenantAsync(Guid tenantId)
    {
        return await _dbSet
            .Include(r => r.Tenant)
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .Where(r => r.TenantId == tenantId)
            .ToListAsync();
    }

    public async Task<Role?> GetByNameAsync(string name, Guid tenantId)
    {
        return await _dbSet
            .Include(r => r.Tenant)
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Name == name && r.TenantId == tenantId);
    }
}
