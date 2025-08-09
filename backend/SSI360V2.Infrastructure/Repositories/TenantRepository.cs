using Microsoft.EntityFrameworkCore;
using SSI360V2.Core.Entities;
using SSI360V2.Core.Interfaces;
using SSI360V2.Infrastructure.Data;

namespace SSI360V2.Infrastructure.Repositories;

public class TenantRepository : Repository<Tenant>, ITenantRepository
{
    public TenantRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tenant?> GetByDomainAsync(string domain)
    {
        return await _dbSet
            .Include(t => t.Users)
            .Include(t => t.Roles)
            .FirstOrDefaultAsync(t => t.Domain == domain);
    }
}
